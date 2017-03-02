import { Component, OnInit } from '@angular/core';
import { AngularFire, FirebaseListObservable } from 'angularfire2';

@Component({
	selector: 'app-user-stories',
	templateUrl: './user-stories.component.html',
	styleUrls: ['./user-stories.component.css']
})
export class UserStoriesComponent implements OnInit {

	model: FirebaseListObservable<any[]>;
	favorites: FirebaseListObservable<any[]>;
	findLike: FirebaseListObservable<any[]>;

	user: string;
	counter: number = 0;
	stories: any[];
	liked: boolean;
	
	constructor(public af: AngularFire) {
		this.favorites = this.af.database.list('favorites');
        this.af.auth.subscribe(
            (auth) => {
                if (auth) {
                    this.user = auth.uid;
                }
            }
        );
		this.model = this.af.database.list('stories', {
			query: {
				orderByChild: 'user',
				equalTo: this.user
			}
		});
        this.findLike = this.af.database.list('favorites', {
			query: {
				orderByChild: 'uid',
				equalTo: this.user,
			}
		});

        this.model.subscribe(
        	dataStory => {
        		dataStory.forEach(
        			story => {
				       	this.favorites.subscribe(
				        	dataFav => {
				        		dataFav.forEach(
				        			favorite => {
				        				if (story.$key == favorite.storyid) {
				        					this.counter = this.counter + 1;
				        					if (favorite.uid == this.user) {
				        						this.liked = true;
				        					}
				        				}
				        			}
				        		)
				        		story.favorite = this.counter;
						        this.counter = 0;
						        
				        		if (this.liked) {
				        			story.liked = true;
				        		}
				        		else {
				        			story.liked = false;
				        		}
				        	}
				        )
				       	this.af.database.list('users' + '/' + story.user).subscribe(
				        	dataUser => {
				        		dataUser.forEach(
				        			storyUser => {
				        				if (storyUser.$key == 'username') {
				        					story.user = storyUser.$value;
				        				}
				        			}
				        		)
				        	}
				        )
        			}
        		)
    			this.stories =  dataStory;
        	}
        );
	}

	ngOnInit() { }

	destroyStory(key: string) {
		this.model.remove(key);
	}

	addFavorite(key: string) {
		this.favorites.push({ uid: this.user, storyid: key });
	}

	removeFavorite(key: string) {
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