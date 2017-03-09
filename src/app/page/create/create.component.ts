import { Component, OnInit, ElementRef, NgZone, ViewChild, Inject } from '@angular/core';
import { AngularFire, FirebaseListObservable } from 'angularfire2';
import { Story } from './../../class/story';
import { MapsAPILoader } from 'angular2-google-maps/core';
import { Ng2ImgToolsService } from 'ng2-img-tools';
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


    constructor(private af: AngularFire, private mapsAPILoader: MapsAPILoader, private ngZone: NgZone, private ng2ImgToolsService: Ng2ImgToolsService) {
        this.stories = af.database.list('stories');
        this.requests = af.database.list('requests');


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


    onChange(event) {
        var that = this;
        let path: string = 'images/' + Math.random().toString(36).substr(2, 9) + '.jpg';
        var files = event.srcElement.files;
        this.ng2ImgToolsService.resize([files[0]], 600, 400).subscribe((result) => {
            if (typeof result.name !== 'undefined' && typeof result.size !== 'undefined' && typeof result.type !== 'undefined') {
                let uploadTask: any = this.storageRef.child(path).put(result);
                uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, function (snapshot) {
                    var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    console.log('Upload is ' + progress + '% done');
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
                    var downloadURL = uploadTask.snapshot.downloadURL;
                    that.model.imageURL = downloadURL;
                });
            }
            else {
                console.error(result);
            }
        });


    }




    storeStory() {
        this.stories.push(this.model).then(() => {
            this.success = 'Successfully added';
            this.requests.push({ sid: this.model.user, rid: this.model.touser, seen: false });
            this.model = new Story();
        }).catch((error: any) => {
            this.error = error;
        });
    }

}