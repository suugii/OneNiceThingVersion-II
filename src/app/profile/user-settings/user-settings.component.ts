import { Component, OnInit, ViewChild } from '@angular/core';
import { User } from './../../class/user';
import { AuthService } from "./../../service/auth.service";
import * as _ from 'lodash';
import { ImageResult, ResizeOptions } from 'ng2-imageupload';
import * as firebase from 'firebase';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ImageCropperComponent, CropperSettings, Bounds } from 'ng2-img-cropper';

@Component({
    selector: 'app-user-settings',
    templateUrl: './user-settings.component.html',
    styleUrls: ['./user-settings.component.css']
})
export class UserSettingsComponent implements OnInit {
    public user = new User();
    public message: any;
    public classCondition: boolean;
    public isAnonymous: boolean;
    public userData: any;
    src: string = "";
    public storageRef: any = firebase.storage().ref();
    resizeOptions: ResizeOptions = {
        resizeMaxHeight: 200,
        resizeMaxWidth: 300
    };
    public isProgressed: boolean;
    public upgradeUserForm: FormGroup;

    data: any;

    cropperSettings: CropperSettings;

    croppedWidth: number;
    croppedHeight: number;

    @ViewChild('cropper', undefined)
    cropper: ImageCropperComponent;
    constructor(private authService: AuthService, private fb: FormBuilder, ) {
        this.data = {};
    }

    ngOnInit() {
        this.buildForm();
        this.authService.af.auth.subscribe(
            (data) => {
                if (data) {
                    this.authService.getUser(data.uid).subscribe(snapshot => {
                        if (snapshot.$exists()) {
                            this.userData = snapshot;
                            this.user.username = snapshot.username;
                            this.user.firstname = snapshot.firstname;
                            this.user.lastname = snapshot.lastname;
                            let imgObj = new Image();
                            imgObj.src = snapshot.photo64;
                            this.cropper.setImage(imgObj);
                        }
                    });
                    if (data.auth.isAnonymous == true) {
                        this.isAnonymous = true;
                    }
                    else {
                        this.isAnonymous = false;
                    }
                }
            }
        );
        this.cropperSettings = new CropperSettings();
        this.cropperSettings.fileType = "image/jpeg";

        this.cropperSettings.width = 300;
        this.cropperSettings.height = 300;

        this.cropperSettings.croppedWidth = 300;
        this.cropperSettings.croppedHeight = 300;

        this.cropperSettings.canvasWidth = 300;
        this.cropperSettings.canvasHeight = 300;

        this.cropperSettings.rounded = false;
        this.cropperSettings.keepAspect = true;

        this.cropperSettings.noFileInput = true;
        this.cropperSettings.cropperDrawSettings.strokeColor = 'rgba(0,0,0,0.5)';
        this.cropperSettings.cropperDrawSettings.strokeWidth = 1;
    }



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
        var that = this;
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

    upgradeUser(event) {
        event.preventDefault();
        var result = _.pickBy(this.user, _.identity);
        this.authService.anonymousToPermanent(this.user).then((data) => {
            if (data) {
                this.message = 'Succesfully Upgraded Your Account';
                this.classCondition = true;
                delete this.user.password;
                this.authService.saveUserInfoFromForm(data.uid, result).then(() => {
                    this.isAnonymous = false;
                }).catch((error) => {
                    if (error) {
                        this.classCondition = false;
                        this.message = error.message;
                    }
                });
            }
        }).catch(error => {
            if (error) {
                this.classCondition = false;
                this.message = error.message;
            }
        })
    }

    updateUser(event) {
        event.preventDefault();
        var userdata = this.authService.getUser(this.userData.$key).take(1);
        userdata.subscribe(snapshot => {
            if (snapshot.$exists()) {
                delete this.user.password;
                delete this.user.email;
                delete this.user.location;
                delete this.user.created_at;
                var result = _.pickBy(this.user, _.identity);
                this.authService.updateUser(result, snapshot.$key).then(() => {
                    this.classCondition = true;
                    this.message = 'Succesfully Updated Your Account';
                }).catch(error => {
                    if (error) {
                        this.classCondition = false;
                        this.message = error.message;
                    }
                })
            }
        });
    }

    cropped(bounds: Bounds) {
        this.croppedHeight = bounds.bottom - bounds.top;
        this.croppedWidth = bounds.right - bounds.left;
        this.user.photo64 = this.data.image;
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

    buildForm(): void {
        this.upgradeUserForm = this.fb.group({
            'email': [this.user.email, [Validators.required]],
            'firstname': [this.user.firstname, [Validators.required]],
            'username': [this.user.username, [Validators.required]],
            'lastname': [this.user.lastname, [Validators.required]],
            'password': [this.user.password, [
                Validators.required,
                Validators.minLength(6),
            ]],

        });
        this.upgradeUserForm.valueChanges
            .subscribe(data => this.onValueChanged(data));
        this.onValueChanged();
    }
    onValueChanged(data?: any) {
        if (!this.upgradeUserForm) { return; }
        const form = this.upgradeUserForm;
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
        'firstname': '',
        'username': '',
        'lastname': '',
    };
    validationMessages = {
        'email': {
            'required': 'Please enter your email.',
            'pattern': 'Email is required and format should be john@doe.com.',
        },
        'firstname': {
            'required': 'Please enter your firstname.',
        },
        'lastname': {
            'required': 'Please enter your lastname.',
        },
        'username': {
            'required': 'Please enter your username.',
        },
        'password': {
            'required': 'Please enter your password.',
            'minlength': 'Email must be at least 6 characters long.',
        },
    };

}
