import { Component, OnInit } from '@angular/core';
import { AngularFire, FirebaseListObservable } from 'angularfire2';
import { SebmGoogleMap, SebmGoogleMapPolygon, LatLngLiteral } from 'angular2-google-maps/core';
import { MapsAPILoader } from 'angular2-google-maps/core';

@Component({
  selector: 'app-user-map',
  templateUrl: './user-map.component.html',
  styleUrls: ['./user-map.component.css']
})
export class UserMapComponent implements OnInit {

  lat: number = 40.363870;
  lng: number = -87.770010;
  zoom: number = 2;
  user: string;
  objects: any[];


  constructor(private af: AngularFire, private mapsAPILoader: MapsAPILoader) {



    this.af.auth.subscribe(
      (auth) => {
        if (auth) {
          this.user = auth.uid;
        }
      }
    );


    this.af.database.list('stories', {
      query: {
        orderByChild: 'user',
        equalTo: this.user,
      }
    }).subscribe(datas => {
      this.objects = [];
      datas.forEach(data => {
        this.af.database.object('users/' + data.touser).subscribe(userData => {
          data.touser = userData;
        })
        this.af.database.object('users/' + data.user).subscribe(userData => {
          data.user = userData;
        })
        this.objects.push(data);
      })
    });

  }

  ngOnInit() {
  }

}
