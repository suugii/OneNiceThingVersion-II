import { Component, OnInit, OnDestroy, AfterViewChecked, ElementRef, ViewChild } from '@angular/core';
import { AuthService } from './../../service/auth.service';
import { AngularFire, AuthProviders, AuthMethods, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2';
import * as _ from 'lodash';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Thread } from '../../class/thread';
import { Message } from '../../class/message';
import * as moment from "moment";
import { DomSanitizer, SafeHtml } from "@angular/platform-browser";

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
	public showMessage: boolean = false;
	public isRead: boolean;
	public mythreads: any[];
	public newMessage = new Message();
	public newThread = new Thread();
	public destroyThread: any;
	public limit: BehaviorSubject<number> = new BehaviorSubject<number>(10);
	@ViewChild('scrollMe') private myScrollContainer: ElementRef;
	constructor(public authservice: AuthService, public af: AngularFire, private _sanitizer: DomSanitizer) {
		this.af.auth.subscribe(auth => {
			if (auth) {
				this.currentUser = auth;
			}
		});

		this.authservice.getUsers().subscribe(datas => {
			var result = _.pickBy(_.reject(datas, { $key: this.currentUser.uid }), function (v, k) {
				if (v.email) {
					return v;
				}
			});
			this.users = _.toArray(result);
		});

		this.checkThread();
	}
	checkThread() {
		this.destroyThread = this.af.database.list('threads').subscribe((threads) => {
			this.mythreads = [];
			if (threads) {
				threads.forEach((thread) => {
					if (thread.userID == this.currentUser.uid || thread.receiverID == this.currentUser.uid) {
						if (thread.userID == this.currentUser.uid) {
							thread.receiverPerson = this.af.database.object('/users/' + thread.receiverID);
							thread.name = thread.user2name;
						} else {
							thread.receiverPerson = this.af.database.object('/users/' + thread.userID);
							thread.name = thread.user1name;
						}
						if (thread.lastMessage) {
							this.mythreads.push(thread);
						}
					}
				})
				this.threads = _.orderBy(this.mythreads, ['date'], ['desc']);
				let latest = _.head(this.threads);
				if (latest) {
					this.getMessages(latest);
				}
			}
		});
	}
	ngOnInit() {
	}

	ngOnDestroy() {
		this.destroyThread.unsubscribe();
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
		if (data.userID == this.currentUser.uid || data.receiverID == this.currentUser.uid) {
			if (data.userID == this.currentUser.uid) {
				data.name = data.user2name;
			} else {
				data.name = data.user1name;
			}
		}
		let user = data.receiverPerson;
		delete data.receiverPerson;
		if (data.senderPerson != this.currentUser.uid) {
			data.isRead = true;
			this.af.database.object('/threads/' + data.$key).set(data);
		}
		this.isRead = data.isRead;
		this.messages = '';
		data.receiverPerson = user;
		this.receiver = data;
		this.messages = this.af.database.list('messages');
		this.messages.subscribe(messages => {
			this.userMessages = [];
			messages.forEach(message => {
				if (message.thread == data.$key) {
					message.sender = user;
					this.userMessages.push(message);
				}
			})
		})
		
	}

	isMe(email) {
		if (email == this.currentUser.auth.email)
			return true;
		else
			return false;
	}

	autocompleListFormatter = (data: any): SafeHtml => {
		let html = `<span>${data.email}</span>`;
		return this._sanitizer.bypassSecurityTrustHtml(html);
	}
	valueChanged(newVal) {
		this.createNewMsg(newVal);
	}

	createNewMsg(data) {
		var isAvailable = false;
		var thread;
		var currentUser = this.currentUser;
		this.af.database.list('threads').subscribe(snapshots => {
			thread = "";
			_.forEach(snapshots, function (snapshot) {
				if ((snapshot.userID == currentUser.uid && snapshot.receiverID == data.$key) || (snapshot.userID == data.$key && snapshot.receiverID == currentUser.uid)) {
					isAvailable = true;
					thread = snapshot;
					return;
				}
			});

		});
		if (isAvailable == false) {
			this.newThread.userID = this.currentUser.uid;
			this.newThread.receiverID = data.$key;
			this.newThread.lastMessage = this.msgVal;
			this.newThread.user2name = data.email;
			this.newThread.senderPerson = this.currentUser.uid;
			this.newThread.user1name = this.currentUser.auth.email;
			this.newThread.date = _.now();
			this.af.database.list('threads').push(this.newThread).then((resp) => {
				this.af.database.object('/threads/' + resp.key).take(1).subscribe(data => {
					this.getMessages(data);
				})
			})
		} else {
			this.getMessages(thread);
		}
	}

	chatSend(e) {
		if (e.length !== 0) {
			this.af.database.object('/threads/' + this.receiver.$key).take(1).subscribe(data => {
				this.newMessage.message = this.msgVal;
				this.newMessage.name = this.currentUser.auth.email;
				this.newMessage.date = _.now();
				this.newMessage.thread = data.$key;
				data.lastMessage = this.msgVal;
				data.date = _.now();
				data.senderPerson = this.currentUser.uid;
				data.isRead = false;
				this.af.database.object('/threads/' + data.$key).set(data);
				this.messages.push(this.newMessage);
			});
			this.msgVal = '';
		}
	}
}
