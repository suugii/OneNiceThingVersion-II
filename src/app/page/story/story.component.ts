import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { AngularFire, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2';
import { StoryService } from "../../service/story.service";
import { AuthService } from "../../service/auth.service";

@Component({
	selector: 'app-story',
	templateUrl: './story.component.html',
	styleUrls: ['./story.component.css']
})
export class StoryComponent implements OnInit {

	key: any = this.route.snapshot.params['key'];

	favorites: FirebaseListObservable<any[]>;
	object: FirebaseObjectObservable<any>;

	story: any;
	counter: number = 0;
	favorited: boolean = false;
	user: any;

	lat: number = 47.919991;
	lng: number = 106.917708;
	latA: number = 47.907018;
	lngA: number = 106.908609;
	zoom: number = 13;

	iconURL: any = {
		url: "http://www.famousbirthdays.com/headshots/ne-yo-3.jpg",
		scaledSize: {
			height: 40,
			width: 40
		}
	};
	iconURL1: any = {
		url: "http://www.famousbirthdays.com/headshots/ne-yo-3.jpg",
		scaledSize: {
			height: 40,
			width: 40
		}
	}


	constructor(public authService: AuthService, private router: Router, private route: ActivatedRoute, private af: AngularFire, private storyService: StoryService) {
		this.authService.af.auth.subscribe(
			(auth) => {
				if (auth) {
					this.user = auth.uid;
				}
			}
		);

		this.favorites = this.af.database.list('favorites', {
			query: {
				orderByChild: 'sid',
				equalTo: this.key
			}
		});
		this.object = this.af.database.object('stories' + '/' + this.key);

		this.object.subscribe(
			(object) => {
				this.favorites.subscribe(
					dataFav => {
						dataFav.forEach(
							favorite => {
								this.counter = this.counter + 1;
								if (favorite.uid == this.user) {
									this.favorited = true;
								}
							}
						)
						object.favorite = this.counter;
						this.counter = 0;
						object.favorited = this.favorited;
						this.favorited = false;
					}
				)
				object.user = this.af.database.object('users' + '/' + object.user);
				object.touser = this.af.database.object('users' + '/' + object.touser);
				this.story = object;
			}
		);
	}

	ngOnInit() {

	}



}
