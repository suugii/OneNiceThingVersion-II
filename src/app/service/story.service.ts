import { Injectable } from '@angular/core';
import { AngularFire, FirebaseListObservable } from 'angularfire2';

@Injectable()
export class StoryService {

	favorites: FirebaseListObservable<any[]>;

	user: string;

	constructor(private af: AngularFire) {
	    this.af.auth.subscribe(
	        (auth) => {
	            if (auth) {
	                this.user = auth.uid;
	            }
	        }
	    );
		this.favorites = this.af.database.list('favorites');
	}

	addFavorite(key: string) {
        this.af.auth.subscribe(
            (auth) => {
                if (auth) {
					this.favorites.push({ uid: this.user, storyid: key });
                }
            }
        );
	}

	removeFavorite(key: string) {
        this.af.auth.subscribe(
            (auth) => {
                if (auth) {
					this.favorites.subscribe(
			        	(dataFav) => {
			        		dataFav.forEach(
			        			(favorite) => {
			        				if (favorite.uid == this.user && favorite.storyid == key) {
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
