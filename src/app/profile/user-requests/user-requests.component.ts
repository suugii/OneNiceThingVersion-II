import { Component, OnInit } from '@angular/core';
import { AngularFire, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2';

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

	constructor(public af: AngularFire) {
	    this.af.auth.subscribe(
	        (auth) => {
	            if (auth) {
	                this.uid = auth.uid;
	            }
	        }
	    );
		this.requests = this.af.database.list('requests', {
			query: {
				orderByChild: 'rid',
				equalTo: this.uid
			}
		});
	   	this.requests.subscribe(
	    	dataReq => {
				this.array = [];
	    		dataReq.forEach(
	    			request => {
	    				this.af.database.list('requests').update(request.$key, { seen: true });
						this.user = this.af.database.object('users' + '/' + request.sid);
						request.user = this.user;
						this.array.push(request);
	    			}
	    		)
	    	}
	    );
	}

	ngOnInit() {
	}

	approve(key) {
		this.af.database.object('requests' + '/' + key).subscribe(
	    	request => {
		        this.af.database.list('friends').push({created_at: Date.now()}).then((friend) => {
					this.af.database.list('friends' + '/' + friend.key + '/' + 'users').push({uid: request.sid}).then(() => {
						this.af.database.list('friends' + '/' + friend.key + '/' + 'users').push({uid: request.rid}).then(() => {
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
