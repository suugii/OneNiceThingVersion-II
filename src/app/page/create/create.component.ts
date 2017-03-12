import { Component, OnInit, ElementRef, NgZone, ViewChild, Inject } from '@angular/core';
import { AngularFire, FirebaseListObservable } from 'angularfire2';
import { Story } from './../../class/story';
import { MapsAPILoader } from 'angular2-google-maps/core';
import { ImageResult, ResizeOptions } from 'ng2-imageupload';
import { ImageCropperComponent, CropperSettings } from 'ng2-img-cropper';

import * as firebase from 'firebase';

@Component({
    selector: 'app-create',
    templateUrl: './create.component.html',
    styleUrls: ['./create.component.css']
})
export class CreateComponent implements OnInit {


    stories: FirebaseListObservable<any[]>;
    requests: FirebaseListObservable<any[]>;

    model: Story = new Story();
    user: string;

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
    data: any;
    cropperSettings: CropperSettings;
    @ViewChild('cropper', undefined)
    cropper: ImageCropperComponent;

    constructor(private af: AngularFire, private mapsAPILoader: MapsAPILoader, private ngZone: NgZone) {
        this.stories = af.database.list('stories');
        this.requests = af.database.list('requests');

        this.cropperSettings = new CropperSettings();
        this.cropperSettings.noFileInput = true;
        this.data = {};

        this.af.auth.subscribe(
            (auth) => {
                if (auth) {
                    this.model.user = auth.uid;
                }
            }
        );
    }

    ngOnInit() {
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
                    this.model.location = obj;
                });
            });
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
            that.isValid = true;
            var downloadURL = uploadTask.snapshot.downloadURL;
            that.model.imageURL = downloadURL;
        });
    }


    storeStory(e) {
        e.preventDefault();
        this.stories.push(this.model).then(() => {
            this.success = 'Successfully added';
            this.requests.push({ sid: this.model.user, rid: this.model.touser, seen: false });
            this.model = new Story();
        }).catch((error: any) => {
            this.error = error;
        });
    }

}