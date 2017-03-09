import { Component, OnInit } from '@angular/core';
import { AngularFire, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2';

@Component({
	selector: 'app-dashboard',
	templateUrl: './dashboard.component.html',
	styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

	requests: FirebaseListObservable<any[]>;
	stories: FirebaseListObservable<any[]>;
	favorites: FirebaseListObservable<any[]>;
	user: string;
	array: any[];
	requestCount: number = 0;
	storiesCount: number = 0;
	favoritesCount: number = 0;
	friendsCount: number = 0;
	users: any[];
	isFriend: boolean;

	constructor(public af: AngularFire) {
	    this.af.auth.subscribe(
	        (auth) => {
	            if (auth) {
	                this.user = auth.uid;
	            }
	        }
	    );
		this.requests = this.af.database.list('requests', {
			query: {
				orderByChild: 'rid',
				equalTo: this.user
			}
		});
		this.stories = this.af.database.list('stories', {
			query: {
				orderByChild: 'user',
				equalTo: this.user
			}
		});
		this.favorites = this.af.database.list('favorites', {
			query: {
				orderByChild: 'uid',
				equalTo: this.user
			}
		});
		this.stories.subscribe(
			dataStory => {
				this.storiesCount = dataStory.length;
			}
		);
		this.favorites.subscribe(
			dataFav => {
				this.favoritesCount = dataFav.length;
			}
		);
	   	this.requests.subscribe(
	    	dataReq => {
				this.array = [];
	    		dataReq.forEach(
	    			request => {
    					this.requestCount += 1;
	    			}
	    		)
	    	}
	    );
		this.af.database.list('friends').subscribe(
	    	dataFriends => {
	    		dataFriends.forEach(
	    			friend => {
	    				this.isFriend = false;
	    				this.af.database.list('friends' + '/' + friend.$key + '/' + 'users').subscribe(
	    					dataUsers => {
					    		dataUsers.forEach(
					    			user => {
					    				if(user.uid == this.user) {
					    					this.isFriend = true;
					    				}
					    			}
					    		);
		    					if (this.isFriend) {
						    		dataUsers.forEach(
						    			user => {
						    				if(user.uid !== this.user) {
						    					this.friendsCount += 1;
						    				}
						    			}
						    		);
		    					}
	    					}
    					);
	    			}
	    		);
	    	}
	    );
	}

	ngOnInit() {
	}

}
