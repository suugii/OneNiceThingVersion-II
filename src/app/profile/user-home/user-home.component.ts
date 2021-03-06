import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { AngularFire, FirebaseListObservable } from 'angularfire2';
import { Subject } from 'rxjs/Subject';


@Component({
	selector: 'app-user-home',
	templateUrl: './user-home.component.html',
	styleUrls: ['./user-home.component.css']
})
export class UserHomeComponent implements OnInit {

	lat: number = 40.363870;
	lng: number = -87.770010;
	zoom: number = 2;
	user: string;
	objects: any[];
	storiesCount: number = 0;
	originateCount: number = 0;

	stories: any;
	tostories: any;

	constructor(private af: AngularFire) {
		this.af.auth.subscribe(
			(auth) => {
				if (auth) {
					this.user = auth.uid;
				}
			}
		);

		this.stories = this.af.database.list('stories', {
			query: {
				orderByChild: 'user',
				equalTo: this.user
			}
		}).subscribe(
			dataStory => {
				this.objects = [];
				this.storiesCount = dataStory.length;
				dataStory.forEach(data => {
					this.af.database.object('users/' + data.touser).subscribe(userData => {
						data.touser = userData;
					})
					this.af.database.object('users/' + data.user).subscribe(userData => {
						data.user = userData;
					})
					this.objects.push(data);
				})
			}
		);

		this.tostories = this.af.database.list('stories', {
			query: {
				orderByChild: 'touser',
				equalTo: this.user
			}
		}).subscribe(
			dataStory => {
				this.originateCount = dataStory.length;
			}
		);
	}

	ngOnInit() {
	}

	ngOnDestroy() {
		this.stories.unsubscribe();
		this.tostories.unsubscribe();
	}
}
