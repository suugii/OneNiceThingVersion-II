import { Component, OnInit } from '@angular/core';
import { AngularFire, FirebaseListObservable } from 'angularfire2';
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
  objects: any;

  constructor(private af: AngularFire) {
    this.af.auth.subscribe(
      (auth) => {
        if (auth) {
          this.user = auth.uid;
        }
      }
    );


    this.objects = this.af.database.list('stories', {
      query: {
        orderByChild: 'touser',
        equalTo: this.user,
      }
    });
  }

  ngOnInit() {
  }

}
