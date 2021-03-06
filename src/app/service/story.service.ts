import { Injectable } from '@angular/core';
import { AngularFire, FirebaseListObservable } from 'angularfire2';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import "rxjs/add/operator/map";

@Injectable()
export class StoryService {

	favorites: FirebaseListObservable<any[]>;
	user: string;
	key: string = null;

	objects: FirebaseListObservable<any[]>;


	constructor(private af: AngularFire) {
		this.af.auth.subscribe(
			auth => {
				if (auth) {
					this.user = auth.uid;
				}
			}
		);

		this.favorites = this.af.database.list('favorites', {
			query: {
				orderByChild: 'uid',
				equalTo: this.user
			}
		});
	}

	addFavorite(key: string) {
		this.favorites.push({ uid: this.user, sid: key });
	}

	removeFavorite(key: string) {
		this.favorites.subscribe(
			favData => {
				favData.forEach(
					favorite => {
						if (favorite.sid == key) {
							this.key = favorite.$key;
						}
					}
				)
				if (this.key) {
					this.af.database.list('favorites').remove(this.key);
					this.key = null;
				}
			}
		);
	}

}
