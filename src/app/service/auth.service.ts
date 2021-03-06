import { Injectable } from '@angular/core';
import { AngularFire, AuthProviders, AuthMethods, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2';
import * as firebase from 'firebase';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
@Injectable()
export class AuthService {

	public users: FirebaseListObservable<any>;
	public messages: any;
	public displayName: string;
	public email: string;
	public authuid: any;
	public message: any;

	constructor(public af: AngularFire) {

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

	updateUserPassword(newPassword) {
		return firebase.auth().currentUser.updatePassword(newPassword)
	}

	reauthenticateUser(email, password) {
		const credential = firebase.auth.EmailAuthProvider.credential(
			email,
			password
		)
		return firebase.auth().currentUser.reauthenticate(credential);
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
		return this.af.database.list('users');
	}

	updateUser(data, $key) {
		return this.af.database.object('/users/' + $key).update(data);
	}

}
