import { Component, OnInit } from '@angular/core';
import { AngularFire, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import "rxjs/add/operator/map";

@Component({
	selector: 'app-user-requests',
	templateUrl: './user-requests.component.html',
	styleUrls: ['./user-requests.component.css']
})
export class UserRequestsComponent implements OnInit {

	user: FirebaseObjectObservable<any>;
	requests: FirebaseListObservable<any[]>;
	uid: string;
	array: any[];
	error: any;
	isCounter: boolean;
	limit: BehaviorSubject<number> = new BehaviorSubject<number>(6);
	lastKey: string;
	queryable: boolean = true;

	constructor(public af: AngularFire) {
		this.af.auth.subscribe(
			(auth) => {
				if (auth) {
					this.uid = auth.uid;
				}
			}
		);


		this.af.database.list('/requests', {
			query: {
				orderByChild: 'rid',
				equalTo: this.uid,
				limitToFirst: 1
			}
		}).subscribe((data) => {
			if (data.length > 0) {
				this.lastKey = data[0].$key;
			} else {
				this.lastKey = '';
			}
		});



		this.requests = this.af.database.list('/requests', {
			query: {
				orderByChild: 'rid',
				equalTo: this.uid,
				limitToLast: this.limit,
			}
		}).map((array) => array.reverse()) as FirebaseListObservable<any[]>;


		this.requests.subscribe((data) => {
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

		this.requests.subscribe(
			dataReq => {
				this.isCounter = false;
				this.array = [];
				dataReq.forEach(
					request => {
						this.af.database.list('requests').update(request.$key, { seen: true });
						this.user = this.af.database.object('users' + '/' + request.sid);
						request.user = this.user;
						this.array.push(request);
					}
				)
				if (this.array.length == 0) {
					this.isCounter = true;
					this.queryable = false;
				}
			}
		);
	}


	scrolled(): void {
		if (this.queryable) {
			this.limit.next(this.limit.getValue() + 6);
		}
	}

	ngOnInit() {
	}

	approve(key) {
		this.af.database.object('requests' + '/' + key).subscribe(
			request => {
				this.af.database.list('friends').push({ created_at: Date.now() }).then((friend) => {
					this.af.database.list('friends' + '/' + friend.key + '/' + 'users').push({ uid: request.sid }).then(() => {
						this.af.database.list('friends' + '/' + friend.key + '/' + 'users').push({ uid: request.rid }).then(() => {
							this.af.database.list('requests').remove(key);
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



	decline(key) {
		this.af.database.list('requests').remove(key);
	}

}
