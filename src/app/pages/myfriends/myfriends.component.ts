import { Component, OnInit } from '@angular/core';
import { AfService } from "../../providers/af.service";
import { FirebaseListObservable } from "angularfire2";

@Component({
	selector: 'app-myfriends',
	templateUrl: './myfriends.component.html',
	styleUrls: ['./myfriends.component.css']
})
export class MyfriendsComponent implements OnInit {

	public users: any;
	
	constructor(public afService: AfService) {

	}

	ngOnInit() {
		this.users = this.afService.af.database.list('/users');
	}

}
