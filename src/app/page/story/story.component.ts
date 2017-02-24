import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { AngularFire, FirebaseObjectObservable } from 'angularfire2';

@Component({
	selector: 'app-story',
	templateUrl: './story.component.html',
	styleUrls: ['./story.component.css']
})
export class StoryComponent implements OnInit {

	key: any = this.route.snapshot.params['key'];
	story: FirebaseObjectObservable<any[]>;

	constructor(private router: Router, private route: ActivatedRoute, private af: AngularFire) {
		this.story = this.af.database.object('stories' + '/' + this.key);
	}

	ngOnInit() {
		this.story;
	}

}
