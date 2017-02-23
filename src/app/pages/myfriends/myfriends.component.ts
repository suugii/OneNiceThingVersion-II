import { Component, OnInit } from '@angular/core';
import { AngularFire, FirebaseListObservable } from 'angularfire2';

@Component({
	selector: 'app-myfriends',
	templateUrl: './myfriends.component.html',
	styleUrls: ['./myfriends.component.css']
})
export class MyfriendsComponent implements OnInit {
	
	users: FirebaseListObservable<any[]>;
	
	constructor(public af: AngularFire) {
		this.users = this.af.database.list('users');
	}

	ngOnInit() {
		this.users;
	}

}