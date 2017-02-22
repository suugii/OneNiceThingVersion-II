import { Component, OnInit } from '@angular/core';
import { AfService } from "../../providers/af.service";
import { FirebaseListObservable } from "angularfire2";

@Component({
	selector: 'app-mystories',
	templateUrl: './mystories.component.html',
	styleUrls: ['./mystories.component.css']
})
export class MystoriesComponent implements OnInit {

	public stories: any;
	
	constructor(public afService: AfService) {

	}

	ngOnInit() {
		this.stories = this.afService.af.database.list('/stories');
	}

}