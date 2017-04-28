import { Component, OnInit, ElementRef, NgZone, ViewChild, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AngularFire, FirebaseListObservable } from 'angularfire2';
import { Story } from './../../class/story';
import { MapsAPILoader } from 'angular2-google-maps/core';
import { ImageResult, ResizeOptions } from 'ng2-imageupload';
import { AuthService } from "./../../service/auth.service";
import * as firebase from 'firebase';
import * as _ from 'lodash';
import { DomSanitizer, SafeHtml } from "@angular/platform-browser";
import { Router, ActivatedRoute, Params, RouterStateSnapshot } from '@angular/router';
import { ImageCropperComponent, CropperSettings, Bounds } from 'ng2-img-cropper';
import { SpinnerService } from '../../service/spinner.service';
import { MailService } from '../../service/mail.service';
import { StoryService } from '../../service/story.service';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import "rxjs/add/operator/map";

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

    stories: FirebaseListObservable<any[]>;
    requests: FirebaseListObservable<any[]>;

    model: Story = new Story();
    user: string;
    users: any[] = [];
    public error: any;
    public success: any;
    @ViewChild("search")
    public searchElementRef: ElementRef;
    public storageRef: any = firebase.storage().ref();
    public isValid: boolean = false;
    src: string = "";
    resizeOptions: ResizeOptions = {
        resizeMaxHeight: 200,
        resizeMaxWidth: 300
    };
    public isProgressed: boolean;
    public storyForm: FormGroup;

    isEmpty1: boolean;
    isEmpty2: boolean;
    isEmpty3: boolean;
    isEmpty4: boolean;
    isEmpty5: boolean;
    isEmpty6: boolean;

    isDisabled1: boolean;
    isDisabled2: boolean;
    isDisabled3: boolean;

    data: any;

    cropperSettings: CropperSettings;

    croppedWidth: number;
    croppedHeight: number;

    @ViewChild('cropper', undefined)
    cropper: ImageCropperComponent;

    limit: BehaviorSubject<number> = new BehaviorSubject<number>(4);
    lastKey: string;
    queryable: boolean = true;
    counter: number = 0;
    favorited: boolean = false;
    laststories: any[];
    isCounter: boolean;

    constructor(public spinner: SpinnerService, public storyService: StoryService, public mailservice: MailService, private af: AngularFire, private fb: FormBuilder, private router: Router, private authService: AuthService, private _sanitizer: DomSanitizer, private mapsAPILoader: MapsAPILoader, private ngZone: NgZone) {
        this.stories = af.database.list('stories');
        this.requests = af.database.list('requests');
        this.af.auth.subscribe(
            (auth) => {
                if (auth) {
                    this.model.user = auth.uid;
                    this.user = auth.uid;
                }
            }
        );

        this.authService.getUsers().subscribe(datas => {
            var result = _.pickBy(_.reject(datas, { $key: this.model.user }), function (v, k) {
                if (v.email) {
                    return v;
                }
            });
            this.users = _.toArray(result);
        });

        this.data = {};

        this.af.database.list('stories', {
            query: {
                orderByChild: 'created_at',
                limitToLast: this.limit,
            }
        }).subscribe(
            dataStory => {
                if (dataStory.length == 0) {
                    this.queryable = false;
                }
                dataStory.forEach(
                    story => {
                        this.af.database.list('favorites', {
                            query: {
                                orderByChild: 'sid',
                                equalTo: story.$key
                            }
                        }).subscribe(
                            dataFav => {
                                dataFav.forEach(
                                    favorite => {
                                        this.counter = this.counter + 1;
                                        if (favorite.uid == this.user) {
                                            this.favorited = true;
                                        }
                                    }
                                )
                                story.favorite = this.counter;
                                this.counter = 0;
                                story.favorited = this.favorited;
                                this.favorited = false;
                            }
                            )
                        story.user = this.af.database.object('users' + '/' + story.user);
                        return story;
                    }
                )
                this.queryable = false;
                this.laststories = dataStory;
            });
    }

    valueChanged(newVal) {
        this.model.touser = newVal.$key;
        this.isEmpty1 = true;
        this.checkFirstTab();
    }


    autocompleListFormatter = (data: any): SafeHtml => {
        let html = `<span>${data.email}</span>`;
        return this._sanitizer.bypassSecurityTrustHtml(html);
    }


    ngOnInit() {
        this.spinner.stop();
        this.buildForm();
        this.mapsAPILoader.load().then(() => {
            let autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement);
            autocomplete.addListener("place_changed", () => {
                this.ngZone.run(() => {
                    let place: google.maps.places.PlaceResult = autocomplete.getPlace();
                    if (place.geometry === undefined || place.geometry === null) {
                        return;
                    }
                    var obj = {
                        latitude: null,
                        longitude: null,
                        name: null,
                    };
                    obj.latitude = place.geometry.location.lat();
                    obj.longitude = place.geometry.location.lng();
                    obj.name = place.formatted_address;
                    this.isEmpty2 = true;
                    this.model.location = obj;
                    this.checkFirstTab();
                });
            });
        });
        this.cropperSettings = new CropperSettings();
        this.cropperSettings.fileType = "image/jpeg";

        this.cropperSettings.width = 390;
        this.cropperSettings.height = 265;

        this.cropperSettings.croppedWidth = 390;
        this.cropperSettings.croppedHeight = 265;

        this.cropperSettings.canvasWidth = 390;
        this.cropperSettings.canvasHeight = 265;

        this.cropperSettings.rounded = false;
        this.cropperSettings.keepAspect = true;

        this.cropperSettings.noFileInput = true;
        this.cropperSettings.cropperDrawSettings.strokeColor = 'rgba(0,0,0,0.5)';
        this.cropperSettings.cropperDrawSettings.strokeWidth = 1;
    }

    buildForm(): void {
        this.storyForm = this.fb.group({
            'touser': [this.model.touser, Validators.required],
            'location': [this.model.location, Validators.required],
            'story': [this.model.story, Validators.required],
            'name': [this.model.name, Validators.required],
            'feeling': [this.model.feeling, Validators.required],
            'privacy': [this.model.privacy, Validators.required],
        });
        this.storyForm.valueChanges
            .subscribe(data => this.onValueChanged(data));
        this.onValueChanged();
    }
    onValueChanged(data?: any) {
        if (!this.storyForm) { return; }
        const form = this.storyForm;
        for (const field in this.formErrors) {
            this.formErrors[field] = '';
            const control = form.get(field);
            if (control && control.dirty && !control.valid) {
                const messages = this.validationMessages[field];
                for (const key in control.errors) {
                    this.formErrors[field] += messages[key] + ' ';
                }
            }
        }

    }
    formErrors = {
        'touser': '',
        'location': '',
        'story': '',
        'name': '',
        'feeling': '',
        'privacy': '',
    };
    validationMessages = {
        'touser': {
            'required': 'Please enter your email.',
        },
        'location': {
            'required': 'Please enter your location.',
        },
        'story': {
            'required': 'Do not blank this field.',
        },
        'name': {
            'required': 'Do not blank this field.',
        },
        'feeling': {
            'required': 'Do not blank this field.',
        },
        'privacy': {
            'required': 'Do not blank this field.',
        }

    };
    selected(imageResult: ImageResult) {
        this.src = imageResult.resized
            && imageResult.resized.dataURL
            || imageResult.dataURL;
        this.uploadImage(this.src);
    }

    uploadImage(image) {
        this.isProgressed = true;
        var that = this;
        let path: string = 'image/' + Math.random().toString(36).substr(2, 9) + '.jpg';
        var files = image;
        let uploadTask: any = this.storageRef.child(path).putString(image, 'data_url');
        uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, function (snapshot) {
            var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            switch (snapshot.state) {
                case firebase.storage.TaskState.PAUSED: // or 'paused'
                    console.log('Upload is paused');
                    break;
                case firebase.storage.TaskState.RUNNING: // or 'running'
                    console.log('Upload is running');
                    break;
            }

        }, function (error) {
            switch (error.code) {
                case 'storage/unauthorized':
                    // User doesn't have permission to access the object
                    console.log(error);
                    break;
                case 'storage/canceled':
                    console.log(error);
                    break;
                case 'storage/unknown':
                    // Unknown error occurred, inspect error.serverResponse
                    console.log(error);
                    break;
            }
        }, function () {
            that.isProgressed = false;
            var downloadURL = uploadTask.snapshot.downloadURL;
            that.model.imageURL = downloadURL;
        });
    }


    cropped(bounds: Bounds) {
        this.croppedHeight = bounds.bottom - bounds.top;
        this.croppedWidth = bounds.right - bounds.left;
        this.model.image64 = this.data.image;
        this.uploadImage(this.data.image);
    }

    fileChangeListener($event) {
        let image: any = new Image();;

        let file = $event.target.files[0];
        let myReader: FileReader = new FileReader();
        let that = this;
        myReader.onloadend = function (loadEvent: any) {
            that.cropper.reset();
            image.src = loadEvent.target.result;
            that.cropper.setImage(image);
        };
        myReader.readAsDataURL(file);
    }

    storeStory(e) {
        this.spinner.start();
        this.af.auth.subscribe((auth) => {
            if (!auth) {
                this.router.navigate(['/login']);
            }
            else {
                console.log('success');
                if (this.isEmailAddress(this.model.name)) {
                    this.mailservice.send(this.model.name, this.model.feeling, this.model.message).subscribe((data) => {
                        if (data) {
                            console.log('success');
                        }
                    },
                        err => {
                            if (err) {
                                console.log('error');
                            }
                        });
                }

                this.stories.push(this.model).then((data) => {
                    this.success = 'Successfully added';
                    // this.requests.push({ sid: this.model.user, rid: this.model.touser, seen: false });
                    this.model = new Story();
                    this.router.navigate(['/stories', data.key]);
                }).catch((error: any) => {
                    this.error = error;
                });
            }
        })
    }

    checkTouserEmpty(e) {
        this.isEmpty1 = false;
        this.checkFirstTab();
    }

    checkLocationEmpty(e) {
        this.isEmpty2 = false;
        this.checkFirstTab();
    }

    checkStoryEmpty(e) {
        if (e) {
            if (e.length > 0) {
                this.isEmpty3 = true;
            }
            else {
                this.isEmpty3 = false;
            }
        }
        else {
            this.isEmpty3 = false;
        }
        this.checkFirstTab();
    }

    checkFirstTab() {
        if (this.isEmpty1 == true && this.isEmpty2 == true && this.isEmpty3 == true) {
            this.isDisabled1 = true;
        } else {
            this.isDisabled1 = false;
        }
    }

    checkNameEmpty(e) {
        if (e) {
            if (e.length > 0) {
                this.isEmpty4 = true;
            }
            else {
                this.isEmpty4 = false;
            }
        }
        else {
            this.isEmpty4 = false;
        }
        this.checkSecondTab();
    }

    checkFeelingEmpty(e) {
        if (e) {
            if (e.length > 0) {
                this.isEmpty5 = true;
            }
            else {
                this.isEmpty5 = false;
            }
        }
        else {
            this.isEmpty5 = false;
        }
        this.checkSecondTab();
    }

    checkSecondTab() {
        if (this.isEmpty4 == true && this.isEmpty5 == true) {
            this.isDisabled2 = true;
        } else {
            this.isDisabled2 = false;
        }
    }

    checkPrivacyEmpty(e) {
        if (e) {
            this.isEmpty6 = true;
        }
        else {
            this.isEmpty6 = false;
        }
        this.checkThirdTab();
    }

    checkThirdTab() {
        if (this.isEmpty6 == true) {
            this.isDisabled3 = true;
        } else {
            this.isDisabled3 = false;
        }
    }


    isEmailAddress(str) {
        if (str.match(/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/)) {
            return true;
        } else {
            return false;
        }
    }


}