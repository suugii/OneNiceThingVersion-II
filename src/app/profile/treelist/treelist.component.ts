import { Component, OnInit, Input } from '@angular/core';
import { AngularFire, FirebaseListObservable } from 'angularfire2';
import * as _ from 'lodash';
import { AuthService } from "../../service/auth.service";

@Component({
  selector: 'app-treelist',
  templateUrl: './treelist.component.html',
  styleUrls: ['./treelist.component.css']
})
export class TreelistComponent implements OnInit {
  @Input() treeData: any[];
  @Input() userIDs: any[];
  constructor(private af: AngularFire, public authService: AuthService) {
  }

  ngOnInit() {
  }
  toggleChildren(node: any) {
    this.af.database.list('stories', {
      query: {
        orderByChild: 'user',
        equalTo: node.id,
      }
    }).subscribe(
      dataStory => {
        var that = this;
        var touser = [];
        var uniqueTousers = [];
        _.forEach(dataStory, function (value, key) {
          touser.push(value.touser);
        });
        uniqueTousers = _.uniq(touser);
        _.forEach(uniqueTousers, function (value) {
          that.authService.getUser(value).subscribe((userdata) => {
            var foundedID = _.find(that.userIDs, function (obj) {
              return obj === userdata.$key;
            })
            if (!foundedID) {
              node.children.push({ id: userdata.$key, email: userdata.email, imageURL: userdata.photoURL, children: [] });
              that.userIDs.push(userdata.$key);
            }
          })
        })
      });

  }
}

