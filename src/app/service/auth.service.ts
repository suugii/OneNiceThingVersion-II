import { Injectable } from '@angular/core';
import { AngularFire, AuthProviders, AuthMethods, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2';
import * as firebase from 'firebase';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

@Injectable()
export class AuthService {

	public users: FirebaseListObservable<any>;
	private searchValue: BehaviorSubject<any>;
	public searchTerm: BehaviorSubject<any>;

	public messages: any;
	public displayName: string;
	public email: string;
	public authuid: any;
	public message: any;

	constructor(public af: AngularFire) {

		// this.messages = this.af.database.list('/messages').map(messages => {
		//   for (let message of messages) {
		//     message.sender = this.af.database.object(`/registeredUsers/${message.senderID}`);
		//   }
		//   return messages;
		// });

		this.searchTerm = new BehaviorSubject('senderID');
		this.searchValue = new BehaviorSubject('gDi02sU4XFQGsJesuAvA01HVUOf1');
		this.messages = this.af.database.list('/messages/', {
			query: {
				orderByChild: this.searchTerm,
				equalTo: this.searchValue
			}
		});
	}

	loginWithGoogle() {
		return this.af.auth.login({
			provider: AuthProviders.Google,
			method: AuthMethods.Popup,
		});
	}

	loginWithFacebook() {
		return this.af.auth.login({
			provider: AuthProviders.Facebook,
			method: AuthMethods.Popup,
		});
	}

	loginWithGuest() {
		return this.af.auth.login({
			provider: AuthProviders.Anonymous,
			method: AuthMethods.Anonymous,
		});
	}

	logout() {
		return this.af.auth.logout();
	}

	registerUser(email, password) {
		return this.af.auth.createUser({
			email: email,
			password: password
		});
	}

	saveUserInfoFromForm(uid, userdata) {
		return this.af.database.object('users/' + uid).set(userdata);
	}

	resetPassword(email) {
		return firebase.auth().sendPasswordResetEmail(email);
	}

	updatePassword(code, password) {
		return firebase.auth().confirmPasswordReset(code, password);
	}

	changeUserPassword(password) {
		// return firebase.auth().changePassword(password);
	}

	loginWithEmail(email, password) {
		return this.af.auth.login({
			email: email,
			password: password,
		},
			{
				provider: AuthProviders.Password,
				method: AuthMethods.Password,
			});
	}

	anonymousToPermanent(userdata) {
		var credential = firebase.auth.EmailAuthProvider.credential(userdata.email, userdata.password);
		return firebase.auth().currentUser.link(credential);
	}

	getUser(id) {
		return this.af.database.object('/users/' + id);
	}

	getUsers() {
		return this.users = this.af.database.list('users');
	}

	getMessage(id) {
		this.message = this.af.database.list('/messages', {
			query: {
				equalTo: id
			}
		});
	}

	sendMessage(receiver, text) {
		this.searchTerm.next('senderID');
		this.searchValue.next('gDi02sU4XFQGsJesuAvA01HVUOf1');
		// var message = {
		//   message: text,
		//   displayName: this.displayName,
		//   email: this.email,
		//   timestamp: Date.now(),
		//   senderID: 'gDi02sU4XFQGsJesuAvA01HVUOf1',
		//   receiverID: receiver
		// };
		// this.messages.push(message);
	}

}
