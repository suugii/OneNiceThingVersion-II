import { Component, OnInit, ElementRef } from '@angular/core';
import { AuthService } from "../../service/auth.service";
import { AngularFire, FirebaseListObservable } from 'angularfire2';
import * as _ from 'lodash';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import "rxjs/add/operator/map";
import { DomSanitizer, SafeHtml } from "@angular/platform-browser";

@Component({
	selector: 'app-user-tree',
	templateUrl: './user-tree.component.html',
	styleUrls: ['./user-tree.component.css']
})
export class UserTreeComponent implements OnInit {

	public user: any;
	public myData: any;
	public subTousers: any[];
	limit: BehaviorSubject<number>;

	constructor(private _sanitizer: DomSanitizer, private af: AngularFire, private el: ElementRef, public authService: AuthService) {
		this.authService.af.auth.subscribe(
			(auth) => {
				if (auth) {
					this.user = auth;
					this.authService.getUser(auth.uid).subscribe(data => {
						this.myData = data;
					})
				}

			}
		);
		this.af.database.list('stories', {
			query: {
				orderByChild: 'user',
				equalTo: this.user.uid,
			}
		}).subscribe(
			dataStory => {
				var that = this;
				var touser = [];
				var uniqueTousers = [];
				that.subTousers = [];
				_.forEach(dataStory, function (value, key) {
					touser.push(value.touser);
				});
				uniqueTousers = _.uniq(touser);
				_.forEach(uniqueTousers, function (value) {
					that.authService.getUser(value).subscribe((userdata) => {
						that.subTousers.push(userdata);
					})
				})
				console.log(that.subTousers);
			});
	}

	showTouser(data) {
		var test = this.el.nativeElement.querySelector('.' + data.$key);
		let html = `<span>${data.email}</span>`;
		console.log(test.querySelector('ul').append(html));
	}

	ngOnInit() {
	}

}
