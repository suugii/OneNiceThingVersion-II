import { Component, OnInit } from '@angular/core';
import { AngularFire, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2';
import * as _ from 'lodash';
@Component({
	selector: 'app-user-friends',
	templateUrl: './user-friends.component.html',
	styleUrls: ['./user-friends.component.css']
})
export class UserFriendsComponent implements OnInit {

	uid: string;
	users: any[];
	isFriend: boolean;
	friends: any;

	userFriend: boolean = false;
	friendKey: string;

	constructor(public af: AngularFire) {
		this.af.auth.subscribe(
			(auth) => {
				if (auth) {
					this.uid = auth.uid;
				}
			}
		);
		this.users = [];
		this.friends = this.af.database.list('friends').subscribe(
			dataFriends => {
				dataFriends.forEach(
					friend => {
						this.isFriend = false;
						this.af.database.list('friends' + '/' + friend.$key + '/' + 'users').subscribe(
							dataUsers => {
								dataUsers.forEach(
									user => {
										if (user.uid == this.uid) {
											this.isFriend = true;
										}
									}
								);
								if (this.isFriend) {
									dataUsers.forEach(
										user => {
											if (user.uid !== this.uid) {
												this.users.push(this.af.database.object('users' + '/' + user.uid));
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

	ngOnDestroy() {
		this.friends.unsubscribe();
	}

	unFriend(key: string) {
		// this.af.database.list('friends').subscribe(
		// 	dataFriends => {
		// 		dataFriends.forEach(
		// 			friend => {
		// 				this.af.database.list('friends' + '/' + friend.$key + '/' + 'users').subscribe(
		// 					dataUsers => {
		// 						dataUsers.forEach(
		// 							user => {
		// 								if (user.uid == this.uid) {
		// 									this.userFriend = true;
		// 								}
		// 							}
		// 						);
		// 						if (this.userFriend) {
		// 							dataUsers.forEach(
		// 								user => {
		// 									if (user.uid == key) {
		// 										this.friendKey = friend.$key;
		// 									}
		// 								}
		// 							);
		// 						}
		// 						this.userFriend = false;
		// 					}
		// 				);
		// 			}
		// 		);
		// 	}
		// );
	}
}
