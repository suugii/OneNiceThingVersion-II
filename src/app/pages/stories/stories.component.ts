import { Component, OnInit } from '@angular/core';
import { AfService } from "../../providers/af.service";
import { FirebaseListObservable } from "angularfire2";

@Component({
	selector: 'app-stories',
	templateUrl: './stories.component.html',
	styleUrls: ['./stories.component.css']
})
export class StoriesComponent implements OnInit {

	public stories: any;
	
	constructor(public afService: AfService) {

	}

	ngOnInit() {
		this.stories = this.afService.af.database.list('/stories');
	}
}
