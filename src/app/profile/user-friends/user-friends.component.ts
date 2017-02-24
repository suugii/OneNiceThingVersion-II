import { Component, OnInit } from '@angular/core';
import { AngularFire, FirebaseListObservable } from 'angularfire2';

@Component({
	selector: 'app-user-friends',
	templateUrl: './user-friends.component.html',
	styleUrls: ['./user-friends.component.css']
})
export class UserFriendsComponent implements OnInit {

	users: FirebaseListObservable<any[]>;
	
	constructor(public af: AngularFire) {
		this.users = this.af.database.list('users');
	}

	ngOnInit() {
		this.users;
	}

}
