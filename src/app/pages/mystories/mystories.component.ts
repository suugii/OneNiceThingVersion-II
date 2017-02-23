import { Component, OnInit } from '@angular/core';
import { AngularFire, FirebaseListObservable } from 'angularfire2';

@Component({
	selector: 'app-mystories',
	templateUrl: './mystories.component.html',
	styleUrls: ['./mystories.component.css']
})
export class MystoriesComponent implements OnInit {

	stories: FirebaseListObservable<any[]>;
	
	constructor(public af: AngularFire) { }

	ngOnInit() {
		this.stories = this.af.database.list('stories');
	}

}