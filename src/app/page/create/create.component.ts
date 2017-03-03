import { Component, OnInit, ElementRef, NgZone, ViewChild } from '@angular/core';
import { AngularFire, FirebaseListObservable } from 'angularfire2';
import { Story } from './../../class/story';
import { MapsAPILoader } from 'angular2-google-maps/core';

@Component({
    selector: 'app-create',
    templateUrl: './create.component.html',
    styleUrls: ['./create.component.css']
})
export class CreateComponent implements OnInit {

    stories: FirebaseListObservable<any[]>;

    model: Story = new Story();

    public error: any;
    public success: any;
    @ViewChild("search")
    public searchElementRef: ElementRef;

    constructor(private af: AngularFire, private mapsAPILoader: MapsAPILoader, private ngZone: NgZone) {

        this.stories = af.database.list('stories');

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

    storeStory() {
        this.stories.push(this.model).then(() => {
            this.success = 'Successfully added';
        }).catch((error: any) => {
            this.error = error;
        });
        this.model = new Story();
    }

}