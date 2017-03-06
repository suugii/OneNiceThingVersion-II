import { Component, OnInit, ElementRef, NgZone, ViewChild } from '@angular/core';
import { AngularFire, FirebaseListObservable } from 'angularfire2';
import { Story } from './../../class/story';
import { MapsAPILoader } from 'angular2-google-maps/core';
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
    constructor(private af: AngularFire, private mapsAPILoader: MapsAPILoader, private ngZone: NgZone) {
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
        let path: string = 'images/' + Math.random().toString(36).substr(2, 9) + '.jpg';
        var files = event.srcElement.files;
        let uploadTask: any = this.storageRef.child(path).put(files[0]);
        uploadTask.on('state_changed', function (snapshot) {
            console.log(snapshot);
        }, function (error) {
            console.log(error);
        }, function () {
            var downloadURL = uploadTask.snapshot.downloadURL;
            console.log(downloadURL);
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