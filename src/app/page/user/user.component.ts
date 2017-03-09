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
	requests: FirebaseListObservable<any[]>;
	toRequests: FirebaseListObservable<any[]>;
	friends: FirebaseListObservable<any[]>;
	profile: FirebaseObjectObservable<any>;

	counter: number = 0;
	favorited: boolean = false;
	isRequested: boolean = false;
	isToRequested: boolean = false;
	isFriend:boolean = false;
	isUser: boolean = false;
	userFriend: boolean = false;
	friendKey: string;
	requestKey: string;
	toRequestKey: string;
	user: string;
	stories: any[];
	error: any;
	status: number = 0;

	constructor(private router: Router, private route: ActivatedRoute, private af: AngularFire, private storyService: StoryService) {
	    this.status = 0;
	    this.af.auth.subscribe(
	        (auth) => {
	            if (auth) {
	                this.user = auth.uid;
	                if (this.user == this.key) {
	                	this.isUser = true;
	                }
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
		this.friends = this.af.database.list('friends');
		this.requests = this.af.database.list('requests', {
			query: {
				orderByChild: 'sid',
				equalTo: this.user
			}
	    });
	    this.toRequests = this.af.database.list('requests', {
			query: {
				orderByChild: 'rid',
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
	    this.requests.subscribe(
	    	dataReq => {
	    		dataReq.forEach(
	    			request => {
	    				if (request.rid == this.key) {
	    					this.status = 1;
	    					this.requestKey = request.$key;
	    				}
	    			}
	    		);
	    	}
	    );
	    this.toRequests.subscribe(
	    	dataReq => {
	    		dataReq.forEach(
	    			request => {
	    				if (request.sid == this.key) {
	    					this.status = 2;
	    					this.toRequestKey = request.$key;
	    				}
	    			}
	    		);
	    	}
	    );
		this.friends.subscribe(
	    	dataFriends => {
	    		dataFriends.forEach(
	    			friend => {
	    				this.af.database.list('friends' + '/' + friend.$key + '/' + 'users').subscribe(
	    					dataUsers => {
					    		dataUsers.forEach(
					    			user => {
					    				if(user.uid == this.user) {
					    					this.userFriend = true;
					    				}
					    			}
					    		);
		    					if (this.userFriend) {
						    		dataUsers.forEach(
						    			user => {
						    				if(user.uid == this.key) {
						    					this.isFriend = true;
						    					this.status = 3;
						    					this.friendKey = friend.$key;
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

	ngOnInit() { }

	addFriend() {
        this.af.database.list('requests').push({ sid: this.user, rid: this.key, seen: false });
	}

	cancelRequest() {
		this.requests.remove(this.requestKey);
	}

	unFriend() {
		this.friends.remove(this.friendKey);
	}

	approveRequest() {
		this.af.database.object('requests' + '/' + this.toRequestKey).subscribe(
	    	request => {
		        this.af.database.list('friends').push({created_at: Date.now()}).then((friend) => {
					this.af.database.list('friends' + '/' + friend.key + '/' + 'users').push({uid: request.sid}).then(() => {
						this.af.database.list('friends' + '/' + friend.key + '/' + 'users').push({uid: request.rid}).then(() => {
							this.toRequests.remove(this.toRequestKey);
						}).catch((error: any) => {
				            this.error = error;
				            this.af.database.list('friends').remove(friend.key);
				        });
					}).catch((error: any) => {
			            this.error = error;
			            this.af.database.list('friends').remove(friend.key);
			        });
		        }).catch((error: any) => {
		            this.error = error;
		        });
	    	}
	    );
	}

	declineRequest() {
		this.toRequests.remove(this.toRequestKey);
	}

}