import { Component, OnInit } from '@angular/core';
import { AngularFire, FirebaseListObservable } from 'angularfire2';

@Component({
	selector: 'app-user-stories',
	templateUrl: './user-stories.component.html',
	styleUrls: ['./user-stories.component.css']
})
export class UserStoriesComponent implements OnInit {

	stories: FirebaseListObservable<any[]>;
	
	constructor(public af: AngularFire) {
		this.stories = this.af.database.list('stories');
	}

	ngOnInit() {
		this.stories;
	}

}