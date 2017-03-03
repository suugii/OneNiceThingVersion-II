import { Component, OnInit } from '@angular/core';
import { AngularFire, FirebaseListObservable } from 'angularfire2';
import { StoryService } from "../../service/story.service";

@Component({
	selector: 'app-user-stories',
	templateUrl: './user-stories.component.html',
	styleUrls: ['./user-stories.component.css']
})
export class UserStoriesComponent implements OnInit {

	objects: FirebaseListObservable<any[]>;
	favorites: FirebaseListObservable<any[]>;

	counter: number = 0;
	favorited: boolean = false;
	user: string;
	stories: any[];

	constructor(private af: AngularFire, private storyService: StoryService) {
	    this.af.auth.subscribe(
	        (auth) => {
	            if (auth) {
	                this.user = auth.uid;
	            }
	        }
	    );
		this.objects = this.af.database.list('stories', {
			query: {
				orderByChild: 'user',
				equalTo: this.user
			}
		});

	    this.objects.subscribe(
	    	dataStory => {
	    		dataStory.forEach(
	    			story => {
						this.favorites = this.af.database.list('favorites', {
							query: {
								orderByChild: 'sid',
								equalTo: story.$key
							}
						});
				       	this.favorites.subscribe(
				        	dataFav => {
				        		dataFav.forEach(
				        			favorite => {
			        					this.counter = this.counter + 1;
			        					if (favorite.uid == this.user) {
			        						this.favorited = true;
			        					}
				        			}
				        		)
				        		story.favorite = this.counter;
						        this.counter = 0;
			        			story.favorited = this.favorited;
			        			this.favorited = false;
				        	}
				        )
				       	story.user = this.af.database.object('users' + '/' + story.user);
	    			}
	    		)
	    		this.stories = dataStory;
	    	}
	    );
	}

	ngOnInit() { }

	destroyStory(key: string) {
		this.objects.remove(key);
		this.af.database.list('favorites', {
			query: {
				orderByChild: 'sid',
				equalTo: key
			}
		}).remove();
	}

}