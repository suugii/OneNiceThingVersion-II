import { Component, OnInit } from '@angular/core';
import { AngularFire, FirebaseListObservable } from 'angularfire2';

@Component({
	selector: 'app-stories',
	templateUrl: './stories.component.html',
	styleUrls: ['./stories.component.css']
})
export class StoriesComponent implements OnInit {

	model: FirebaseListObservable<any[]>;
	favorites: FirebaseListObservable<any[]>;
	findLike: FirebaseListObservable<any[]>;

	user: string;
	counter: number = 0;
	stories: any[];
	
	constructor(private af: AngularFire) {
		this.model = this.af.database.list('stories');
		this.favorites = this.af.database.list('favorites');

        this.af.auth.subscribe(
            (auth) => {
                if (auth) {
                    this.user = auth.uid;
                }
            }
        );

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
				       	this.findLike.subscribe(
				        	dataFav => {
				        		dataFav.forEach(
				        			favorite => {
				        				if (story.$key == favorite.storyid) {
				        					this.counter = this.counter + 1;
				        				}
				        			}
				        		)
				        		story.favorite = this.counter;
						        this.counter = 0;
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

	addFavorite(key: string) {
		this.favorites.push({ uid: this.user, storyid: key });
	}

	removeFavorite(key: string) {
		this.findLike.subscribe(
        	(dataFav) => {
        		dataFav.forEach(
        			(favorite) => {
        				if (favorite.storyid == key) {
        					this.findLike.remove(favorite.$key);
        				}
        			}
        		)
        	}
        )
	}		

}