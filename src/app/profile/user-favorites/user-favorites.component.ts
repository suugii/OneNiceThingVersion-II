import { Component, OnInit } from '@angular/core';
import { AngularFire, FirebaseListObservable } from 'angularfire2';

@Component({
  selector: 'app-user-favorites',
  templateUrl: './user-favorites.component.html',
  styleUrls: ['./user-favorites.component.css']
})
export class UserFavoritesComponent implements OnInit {

	stories: FirebaseListObservable<any[]>;
	
	constructor(public af: AngularFire) {
		this.stories = this.af.database.list('stories');
	}

	ngOnInit() {
		this.stories;
	}

}
