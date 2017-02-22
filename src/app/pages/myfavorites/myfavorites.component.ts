import { Component, OnInit } from '@angular/core';
import { AfService } from "../../providers/af.service";
import { FirebaseListObservable } from "angularfire2";

@Component({
	selector: 'app-myfavorites',
	templateUrl: './myfavorites.component.html',
	styleUrls: ['./myfavorites.component.css']
})
export class MyfavoritesComponent implements OnInit {

	public stories: any;
	
	constructor(public afService: AfService) {

	}

	ngOnInit() {
		this.stories = this.afService.af.database.list('/stories');
	}

}
