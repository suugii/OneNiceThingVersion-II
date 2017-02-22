import { Injectable } from '@angular/core';
import { AngularFire, AuthProviders, AuthMethods, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2';
import * as firebase from 'firebase';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

@Injectable()
export class StoryService {
  constructor(public af: AngularFire) { }

  storeStory(data) {
    return this.af.database.list('stories').push(data);
  }

  showStories() {
    return this.af.database.list('/stories').map(stories => {
      for (let story of stories) {
        story.test = this.af.database.object(`/registeredUsers/${story.uid}`);
      }
      return stories;
    });
  }
}
