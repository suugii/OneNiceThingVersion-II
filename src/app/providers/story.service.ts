import { Injectable } from '@angular/core';
import { AngularFire, AuthProviders, AuthMethods, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2';
import * as firebase from 'firebase';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

@Injectable()
export class StoryService {
  constructor(public af: AngularFire) { }

  saveStory(data) {
    return this.af.database.list('stories').push(data);
  }

  getStories() {
    return this.af.database.list('/stories').map(stories => {
      for (let story of stories) {
        story.user = this.af.database.object(`/registeredUsers/${story.user}`);
        story.uid = this.af.database.object(`/registeredUsers/${story.uid}`);
      }
      return stories;
    });
  }
}
