import { Component, OnInit } from '@angular/core';
import { AngularFire, FirebaseListObservable } from 'angularfire2';

@Component({
	selector: 'app-myfavorites',
	templateUrl: './myfavorites.component.html',
	styleUrls: ['./myfavorites.component.css']
})
export class MyfavoritesComponent implements OnInit {

	stories: FirebaseListObservable<any[]>;
	
	constructor(public af: AngularFire) { }

	ngOnInit() {
		this.stories = this.af.database.list('stories');
	}

}