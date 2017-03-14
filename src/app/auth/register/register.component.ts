import { Component, OnInit, ElementRef, NgZone, ViewChild } from '@angular/core';
import { AuthService } from "./../../service/auth.service";
import { Router, ActivatedRoute } from "@angular/router";
import { User } from './../../class/user';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MapsAPILoader } from 'angular2-google-maps/core';
import { ImageResult, ResizeOptions } from 'ng2-imageupload';
import * as firebase from 'firebase';

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

    public error: any;
    public user = new User();
    public returnUrl: string;
    public registerForm: FormGroup;
    @ViewChild("search")
    public searchElementRef: ElementRef;
    src: string = "";
    public storageRef: any = firebase.storage().ref();
    resizeOptions: ResizeOptions = {
        resizeMaxHeight: 200,
        resizeMaxWidth: 300
    };
    public isProgressed: boolean;
    constructor(private route: ActivatedRoute, private fb: FormBuilder, private mapsAPILoader: MapsAPILoader, private authService: AuthService, private router: Router, private ngZone: NgZone) { }

    ngOnInit() {
        this.buildForm();
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
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
                    this.user.location = obj;
                });
            });
        });
    }

    registerUser(event) {
        event.preventDefault();
        this.authService.registerUser(this.user.email, this.user.password).then((user) => {
            delete this.user.password;
            this.authService.saveUserInfoFromForm(user.uid, this.user).then(() => {
                this.router.navigate([this.returnUrl]);
            }).catch((error) => {
                this.error = error;
            });
        }).catch((error) => {
            this.error = error;
        });
    }


    selected(imageResult: ImageResult) {
        this.src = imageResult.resized
            && imageResult.resized.dataURL
            || imageResult.dataURL;
        this.uploadImage(this.src);
    }

    uploadImage(image) {
        var that = this;
        that.isProgressed = true;
        let path: string = 'image/' + Math.random().toString(36).substr(2, 9) + '.jpg';
        var files = image;
        let uploadTask: any = this.storageRef.child(path).putString(image, 'data_url');
        uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, function (snapshot) {
            var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log(progress);
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
            that.user.photoURL = downloadURL;
        });
    }


    loginWithGoogle() {
        this.authService.loginWithGoogle().then((data) => {
            var userdata = this.authService.getUser(data.uid);
            userdata.subscribe(snapshot => {
                if (snapshot.$exists()) {
                    this.router.navigate([this.returnUrl]);
                } else {
                    delete this.user.password;
                    this.user.email = data.auth.email;
                    this.user.photoURL = data.auth.photoURL;
                    this.user.username = data.auth.displayName;
                    this.authService.saveUserInfoFromForm(data.uid, this.user).then(() => {
                        this.router.navigate([this.returnUrl]);
                    })
                        .catch((error) => {
                            this.error = error;
                        });
                }
            });
        })
            .catch((error: any) => {
                if (error) {
                    this.error = error;
                }
            });
    }

    loginWithGuest() {
        this.authService.loginWithGuest().then((data) => {
            delete this.user.password;
            this.authService.saveUserInfoFromForm(data.uid, this.user).then(() => {
                this.router.navigate([this.returnUrl]);
            })
                .catch((error) => {
                    this.error = error;
                });
        })
            .catch((error: any) => {
                if (error) {
                    this.error = error;
                }
            });
    }


    loginWithFacebook() {
        this.authService.loginWithFacebook().then((data) => {
            var userdata = this.authService.getUser(data.uid);
            userdata.subscribe(snapshot => {
                if (snapshot.$exists()) {
                    this.router.navigate([this.returnUrl]);
                } else {
                    delete this.user.password;
                    this.user.email = data.auth.email;
                    this.user.photoURL = data.auth.photoURL;
                    this.user.username = data.auth.displayName;
                    this.authService.saveUserInfoFromForm(data.uid, this.user).then(() => {
                        this.router.navigate([this.returnUrl]);
                    })
                        .catch((error) => {
                            this.error = error;
                        });
                }
            });
        })
            .catch((error: any) => {
                if (error) {
                    this.error = error;
                }
            });
    }


    buildForm(): void {
        this.registerForm = this.fb.group({
            'email': [this.user.email, [Validators.required]],
            'username': [this.user.username, [Validators.required]],
            'location': [this.user.location, [Validators.required]],
            'firstname': [this.user.firstname, [Validators.required]],
            'lastname': [this.user.lastname, [Validators.required]],
            'password': [this.user.password, [
                Validators.required,
                Validators.minLength(6),
            ]],
        });
        this.registerForm.valueChanges
            .subscribe(data => this.onValueChanged(data));
        this.onValueChanged();
    }
    onValueChanged(data?: any) {
        if (!this.registerForm) { return; }
        const form = this.registerForm;
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
        'email': '',
        'password': '',
        'location': '',
        'username': '',
        'firstname': '',
        'lastname': '',
    };
    validationMessages = {
        'email': {
            'required': 'Please enter your email.',
            'pattern': 'Email is required and format should be john@doe.com.',
        },
        'password': {
            'required': 'Please enter your password.',
            'minlength': 'Email must be at least 6 characters long.',
        },
        'location': {
            'required': 'Please enter your location.',
        },
        'username': {
            'required': 'Please enter your username.',
        },
        'firstname': {
            'required': 'Please enter your firstname.',
        },
        'lastname': {
            'required': 'Please enter your lastname.',
        },
    };

}