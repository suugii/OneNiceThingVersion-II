import { Component, OnInit } from '@angular/core';
import { AngularFire, FirebaseListObservable } from 'angularfire2';

@Component({
	selector: 'app-stories',
	templateUrl: './stories.component.html',
	styleUrls: ['./stories.component.css']
})
export class StoriesComponent implements OnInit {

	stories: FirebaseListObservable<any[]>;
	
	constructor(private af: AngularFire) {
		this.stories = this.af.database.list('stories');
	}

	ngOnInit() {
		this.stories;
	}

}