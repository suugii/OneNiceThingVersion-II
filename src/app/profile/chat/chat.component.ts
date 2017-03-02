import { Component, OnInit, AfterViewChecked, ElementRef, ViewChild } from '@angular/core';
import { AuthService } from './../../service/auth.service';
import { AngularFire, AuthProviders, AuthMethods, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2';
import * as _ from 'lodash';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Component({
	selector: 'app-chat',
	templateUrl: './chat.component.html',
	styleUrls: ['./chat.component.css']
})

export class ChatComponent implements OnInit {
	public users: any[] = [];
	public senderID: any;
	public messages: any;
	public userMessages: any[] = [];
	public userName: any;
	public currentUser: any;
	public msgVal: string = '';
	public limit: BehaviorSubject<number> = new BehaviorSubject<number>(10);
	constructor(public authservice: AuthService, public af: AngularFire) {
		this.af.auth.subscribe(auth => {
			if (auth) {
				this.currentUser = auth;
			}
		});
		this.authservice.getUsers().subscribe((users) => {
			this.users = _.reject(users, { $key: this.currentUser.uid });
		})

	}

	ngOnInit() {
	}


	scrolled(): void {
		this.limit.next(this.limit.getValue() + 10);
	}



	onScrollUp() {
		this.scrolled();
	}

	getUser(data) {
		this.messages = '';
		this.senderID = data.$key;
		this.messages = this.af.database.list('messages', {
			query: {
				orderByChild: 'date',
				limitToLast: this.limit
			}
		});
		this.messages.subscribe(snapshots => {
			this.userMessages = [];
			snapshots.forEach(snapshot => {
				if (snapshot.senderID == this.senderID || snapshot.senderID == this.currentUser.uid) {
					this.userMessages.push(snapshot);
				}
			});
		})
	}



	chatSend(theirMessage: string) {
		this.messages.push({ message: theirMessage, senderID: this.senderID, userID: this.currentUser.uid, name: this.currentUser.auth.email, date: Date.now() });
		this.msgVal = '';
	}
}
