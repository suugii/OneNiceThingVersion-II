import { Injectable } from '@angular/core';
import { AngularFire, FirebaseListObservable } from 'angularfire2';

@Injectable()
export class StoryService {

	user: string;
	favorites: FirebaseListObservable<any[]>;

	constructor(private af: AngularFire) {
	    this.af.auth.subscribe(
	        (auth) => {
	            if (auth) {
	                this.user = auth.uid;
	            }
	        }
	    );
	}

	addFavorite(key: string) {
        this.af.auth.subscribe(
            (auth) => {
                if (auth) {
					this.favorites = this.af.database.list('favorites');
					this.favorites.push({uid: this.user, sid: key});
                }
            }
        );
	}

	removeFavorite(key: string) {
        this.af.auth.subscribe(
            (auth) => {
                if (auth) {
					this.favorites = this.af.database.list('favorites', {
						query: {
							orderByChild: 'uid',
							equalTo: this.user
						}
					});
			       	this.favorites.subscribe(
			        	favData => {
			        		favData.forEach(
			        			favorite => {
		        					if (favorite.uid == this.user && favorite.sid == key) {
										this.favorites.remove(favorite.$key);
		        					}
			        			}
			        		)
			        	}
			        )
                }
            }
        );
	}	

}
