import { Injectable } from '@angular/core';
import { AngularFire, FirebaseListObservable } from 'angularfire2';

@Injectable()
export class StoryService {

	user: string;
	favorites: FirebaseListObservable<any[]>;
	key: string;

	constructor(private af: AngularFire) {
	    this.af.auth.subscribe(
	        (auth) => {
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
		this.favorites.push({uid: this.user, sid: key});
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
	    	}
	    );
		this.favorites.remove(this.key);
	}	

}
