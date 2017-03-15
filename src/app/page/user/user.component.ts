import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { AngularFire, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2';
import { StoryService } from "../../service/story.service";
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import "rxjs/add/operator/map";

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
	isFriend: boolean = false;
	isUser: boolean = false;
	userFriend: boolean = false;
	friendKey: string;
	requestKey: string;
	toRequestKey: string;
	user: string;
	stories: any[];
	error: any;
	statusRequest: boolean = false;
	statusToRequest: boolean = false;
	statusFriend: boolean = false;
	isCounter: boolean;
	queryable: boolean;
	limit: BehaviorSubject<number> = new BehaviorSubject<number>(6);
	lastKey: string;

	constructor(private router: Router, private route: ActivatedRoute, private af: AngularFire, private storyService: StoryService) {
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


		this.af.database.list('/stories', {
			query: {
				orderByChild: 'user',
				equalTo: this.key,
				limitToFirst: 1,
			}
		}).subscribe((data) => {
			if (data.length > 0) {
				this.lastKey = data[0].$key;
			} else {
				this.lastKey = '';
			}
		});
		this.objects = this.af.database.list('stories', {
			query: {
				orderByChild: 'user',
				equalTo: this.key,
				limitToLast: this.limit,
			}
		}).map((array) => array.reverse()) as FirebaseListObservable<any[]>;

		this.objects.subscribe((data) => {
			if (data.length > 0) {
				if (data[data.length - 1].$key === this.lastKey) {
					this.queryable = false;
				} else {
					this.queryable = true;
				}
			}
			if (data.length < 6) {
				this.queryable = false;
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
				this.isCounter = false;
				if (dataStory.length == 0) {
					this.isCounter = true;
					this.queryable = false;
				}
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
				this.statusRequest = false;
				dataReq.forEach(
					request => {
						if (request.rid == this.key) {
							this.statusRequest = true;
							this.requestKey = request.$key;
						}
					}
				);
			}
		);
		this.toRequests.subscribe(
			dataReq => {
				this.statusToRequest = false;
				dataReq.forEach(
					request => {
						if (request.sid == this.key) {
							this.statusToRequest = true;
							this.toRequestKey = request.$key;
						}
					}
				);
			}
		);
		this.friends.subscribe(
			dataFriends => {
				this.statusFriend = false;
				dataFriends.forEach(
					friend => {
						this.af.database.list('friends' + '/' + friend.$key + '/' + 'users').subscribe(
							dataUsers => {
								dataUsers.forEach(
									user => {
										if (user.uid == this.user) {
											this.userFriend = true;
										}
									}
								);
								if (this.userFriend) {
									dataUsers.forEach(
										user => {
											if (user.uid == this.key) {
												this.statusFriend = true;
												this.friendKey = friend.$key;
											}
										}
									);
								}
								this.userFriend = false;
							}
						);
					}
				);
			}
		);
	}

	ngOnInit() { }

	scrolled(): void {
		if (this.queryable) {
			this.limit.next(this.limit.getValue() + 6);
		}
	}

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
				this.friends.push({ created_at: Date.now(), users: [{ uid: request.sid }, { uid: request.rid }] }).then((friend) => {
					this.toRequests.remove(this.toRequestKey);
					this.statusFriend = true;
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