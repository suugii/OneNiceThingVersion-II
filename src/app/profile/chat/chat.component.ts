import { Component, OnInit, AfterViewChecked, ElementRef, ViewChild } from '@angular/core';
import { AuthService } from './../../service/auth.service';
import { AngularFire, AuthProviders, AuthMethods, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2';
import * as _ from 'lodash';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Thread } from '../../class/thread';
import { Message } from '../../class/message';
import * as moment from "moment";

@Component({
	selector: 'app-chat',
	templateUrl: './chat.component.html',
	styleUrls: ['./chat.component.css']
})

export class ChatComponent implements OnInit, AfterViewChecked {
	public users: any[] = [];
	public receiver: any;
	public messages: any;
	public userMessages: any[] = [];
	public userName: any;
	public currentUser: any;
	public msgVal: string = '';
	public threads: any[];
	public mythreads: any[];
	public newMessage = new Message();
	public newThread = new Thread();
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
		});

		this.af.database.list('threads').subscribe((threads) => {
			this.mythreads = [];
			if (threads) {
				threads.forEach((thread) => {
					if (thread.userID == this.currentUser.uid) {
						this.mythreads.push(thread);
					}
				})
				this.threads = _.orderBy(this.mythreads, ['date'], ['desc']);
				let latest = _.head(this.mythreads);
				this.getMessages(latest);
			}
		});
	}

	ngOnInit() {

	}

	ngAfterViewChecked() {
		this.scrollToBottom();
	}

	scrollToBottom(): void {
		try {
			this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
		} catch (err) { }
	}

	scrolled(): void {
		this.limit.next(this.limit.getValue() + 10);
	}



	getMessages(data) {
		this.messages = '';
		this.receiver = data;
		console.log(this.receiver);
		this.messages = this.af.database.list('messages');
		this.messages.subscribe(snapshots => {
			this.userMessages = [];
			snapshots.forEach(snapshot => {
				if ((snapshot.receiverID == this.receiver.userID && snapshot.senderID == this.currentUser.uid) || (snapshot.receiverID == this.currentUser.uid && snapshot.senderID == this.receiver.userID)) {
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

	createNewMsg(data) {
		// this.receiver = {};
		// this.receiver.userID = data.$key;
		// this.receiver.email = data.email;
		// this.getMessages(this.receiver);
	}

	chatSend() {
		this.af.database.object('/threads/' + this.receiver.$key).take(1).subscribe(data => {
			this.newMessage.message = this.msgVal;
			this.newMessage.senderID = this.currentUser.uid;
			this.newMessage.receiverID = this.receiver.userID;
			this.newMessage.name = this.currentUser.auth.email;
			this.newMessage.date = moment.now();
			if (data.hasOwnProperty('$value') && !data['$value']) {
				this.newThread.userID = this.receiver.userID;
				this.newThread.lastMessage = this.msgVal;
				this.newThread.name = this.receiver.email;
				this.newThread.date = moment.now();
				this.af.database.list('threads').push(this.newThread).then((resp) => {
					this.newMessage.thread = resp.key;
					this.messages.push(this.newMessage);
				})
			}
			else {
				data.lastMessage = this.msgVal;
				data.date = moment.now();
				this.af.database.object('/threads/' + data.$key).set(data);
				this.messages.push(this.newMessage);
			}
		});
		this.msgVal = '';
	}
}
