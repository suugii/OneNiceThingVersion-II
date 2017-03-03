import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { AngularFire, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2';
import { StoryService } from "../../service/story.service";

@Component({
	selector: 'app-user',
	templateUrl: './user.component.html',
	styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

	key: any = this.route.snapshot.params['key'];

	objects: FirebaseListObservable<any[]>;
	favorites: FirebaseListObservable<any[]>;
	profile: FirebaseObjectObservable<any>;

	counter: number = 0;
	favorited: boolean = false;
	user: string;
	stories: any[];

	constructor(private router: Router, private route: ActivatedRoute, private af: AngularFire, private storyService: StoryService) {
	    this.af.auth.subscribe(
	        (auth) => {
	            if (auth) {
	                this.user = auth.uid;
	            }
	        }
	    );
	    this.profile = this.af.database.object('users' + '/' + this.key);
		this.objects = this.af.database.list('stories', {
			query: {
				orderByChild: 'user',
				equalTo: this.key
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

}