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
	originate: FirebaseListObservable<any[]>;
	favorites: FirebaseListObservable<any[]>;
	user: string;
	requestCount: number = 0;
	storiesCount: number = 0;
	originateCount: number = 0;
	favoritesCount: number = 0;
	friendsCount: number = 0;
	threadsCount: number = 0;
	isFriend: boolean;
	mythreads: any[];
	subsstories: any;
	subsoriginate: any;
	subsfavorites: any;
	subsrequests: any;
	substhreads: any;
	subsfriends: any;

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
		this.originate = this.af.database.list('stories', {
			query: {
				orderByChild: 'touser',
				equalTo: this.user
			}
		});
		this.favorites = this.af.database.list('favorites', {
			query: {
				orderByChild: 'uid',
				equalTo: this.user
			}
		});
		this.subsstories = this.stories.subscribe(
			dataStory => {
				this.storiesCount = dataStory.length;
			}
		);
		this.subsoriginate = this.originate.subscribe(
			dataStory => {
				this.originateCount = dataStory.length;
			}
		);
		this.subsfavorites = this.favorites.subscribe(
			dataFav => {
				this.favoritesCount = dataFav.length;
			}
		);
		this.subsrequests = this.requests.subscribe(
			dataReq => {
				this.requestCount = 0;
				dataReq.forEach(
					request => {
						if (!request.seen) {
							this.requestCount += 1;
						}
					}
				)
			}
		);

		this.substhreads = this.af.database.list('threads').subscribe((threads) => {
			this.mythreads = [];
			if (threads) {
				threads.forEach((thread) => {
					if (thread.userID == this.user || thread.receiverID == this.user) {
						if (thread.senderPerson != this.user && thread.isRead == false) {
							if (thread.lastMessage) {
								this.mythreads.push(thread);
							}
						}
					}
				})
			}
			this.threadsCount = this.mythreads.length;
		});

		this.subsfriends = this.af.database.list('friends').subscribe(
			dataFriends => {
				dataFriends.forEach(
					friend => {
						this.isFriend = false;
						this.af.database.list('friends' + '/' + friend.$key + '/' + 'users').subscribe(
							dataUsers => {
								dataUsers.forEach(
									user => {
										if (user.uid == this.user) {
											this.isFriend = true;
										}
									}
								);
								if (this.isFriend) {
									dataUsers.forEach(
										user => {
											if (user.uid !== this.user) {
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

	nfOnDestroy() {
		this.subsstories.unsubscribe();
		this.subsoriginate.unsubscribe();
		this.subsfavorites.unsubscribe();
		this.subsrequests.unsubscribe();
		this.substhreads.unsubscribe();
		this.subsfriends.unsubscribe();
	}

}
