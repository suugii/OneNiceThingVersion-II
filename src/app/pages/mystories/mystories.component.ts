import { Component, OnInit } from '@angular/core';
import { AngularFire, FirebaseListObservable } from 'angularfire2';

@Component({
	selector: 'app-mystories',
	templateUrl: './mystories.component.html',
	styleUrls: ['./mystories.component.css']
})
export class MystoriesComponent implements OnInit {

	stories: FirebaseListObservable<any[]>;
	
	constructor(public af: AngularFire) { 
		this.stories = af.database.list('stories');
	}

	ngOnInit() {
		this.stories;
	}

	updateStory(key: string, data) {
		this.stories.update(key, data);
	}

	deleteStory(key: string) {    
		this.stories.remove(key); 
	}

}