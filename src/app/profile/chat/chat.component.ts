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

export class ChatComponent implements OnInit, AfterViewChecked {
	public users: any[] = [];
	public senderID: any;
	public messages: any;
	public userMessages: any[] = [];
	public userName: any;
	public currentUser: any;
	public msgVal: string = '';
	public limit: BehaviorSubject<number> = new BehaviorSubject<number>(10);
	@ViewChild('scrollMe') private myScrollContainer: ElementRef;
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

	ngAfterViewChecked() {
		this.scrollToBottom();
	}
	
	scrollToBottom(): void {
		try {
			this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
		} catch (err) { console.log('Scroll to bottom failed yo!') }
	}

	scrolled(): void {
		this.limit.next(this.limit.getValue() + 10);
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
				if ((snapshot.senderID == this.senderID && snapshot.userID == this.currentUser.uid) || (snapshot.senderID == this.currentUser.uid && snapshot.userID == this.senderID)) {
					this.userMessages.push(snapshot);
				}
			});
		})
	}

	isYou(email) {
		if (email == this.currentUser.auth.email)
			return true;
		else
			return false;
	}
	isMe(email) {
		if (email == this.currentUser.auth.email)
			return false;
		else
			return true;
	}

	chatSend(theirMessage: string) {
		this.messages.push({ message: theirMessage, senderID: this.senderID, userID: this.currentUser.uid, name: this.currentUser.auth.email, date: Date.now() });
		this.msgVal = '';
	}
}
