import { Injectable } from '@angular/core';
import { AngularFire, FirebaseListObservable } from 'angularfire2';

@Injectable()
export class StoryService {

	user: string;
	key: string = null;

	constructor(private af: AngularFire) {
	    this.af.auth.subscribe(
	        auth => {
	            if (auth) {
	                this.user = auth.uid;
	            }
	        }
	    );
	}

	addFavorite(key: string) {
		this.af.database.list('favorites').push({uid: this.user, sid: key});
	}

	removeFavorite(key: string) {
		this.af.database.list('favorites', {
			query: {
				orderByChild: 'uid',
				equalTo: this.user
			}
	    }).subscribe(
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
