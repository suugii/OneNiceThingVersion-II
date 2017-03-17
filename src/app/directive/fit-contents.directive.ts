import { Directive, Input, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { LatLngBounds, LatLng, MapsAPILoader } from 'angular2-google-maps/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

// This API object is not valid to use before ngAfterViewInit has been called.
// See https://github.com/SebastianM/angular2-google-maps/issues/782 for details.
declare var google: any;

@Directive({
    selector: '[fitContents]',
    exportAs: 'fitContentsDirective'
})
export class FitContentsDirective implements OnInit, OnDestroy, AfterViewInit {
    @Input() public fitContents: Subject<Coordinates[]> = new Subject<Coordinates[]>();

    public mapBounds: LatLngBounds = null;

    private mapLoadedSubject: Subject<boolean> = new Subject<boolean>();
    private destroyed$: Subject<any> = new Subject();

    constructor(private mapsAPILoader: MapsAPILoader) { }

    public ngOnInit() {
        // Create an observable that emits a value when either one of
        // mapLoadedSubject or fitContents is updated / emits a value
        Observable.combineLatest(this.mapLoadedSubject, this.fitContents)
            .takeUntil(this.destroyed$)
            .subscribe(([mapLoaded, coordinates]) => {
                this.onFitContents(coordinates, mapLoaded);
            });
    }

    public ngAfterViewInit() {
        // This callback will return when the google maps component
        // is finished loading. At this point, the declared "google"
        // variable will contain an object reference, making functions
        // needed by onFitContents available for use.
        this.mapsAPILoader.load().then(() => {
            this.mapLoadedSubject.next(true);
            this.mapLoadedSubject.complete();
        });
    }

    public ngOnDestroy() {
        this.destroyed$.next();
    }

    /**
     * Take an array of coordinates and convert to Google Maps LatLngBounds (if google maps is loaded)
     */
    private onFitContents(coordinates: Coordinates[], mapLoaded: boolean) {
        // We must wait for mapLoaded to become true, because before that
        // the "google" api variable is undefined.
        if (!mapLoaded || coordinates.length === 0) {
            return;
        }

        let bounds: LatLngBounds = new google.maps.LatLngBounds();
        for (let coordinate of coordinates) {
            let point: LatLng = new google.maps.LatLng(coordinate.latitude, coordinate.longitude);
            bounds.extend(point);
        }
        this.mapBounds = bounds;
    }
}