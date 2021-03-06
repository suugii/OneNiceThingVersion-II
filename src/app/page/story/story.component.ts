import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { AngularFire, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2';
import { StoryService } from "../../service/story.service";
import { AuthService } from "../../service/auth.service";
import { SpinnerService } from '../../service/spinner.service';

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
	zoom: number = 13;
	storylocation: any;
	constructor(public spinner: SpinnerService, public authService: AuthService, private router: Router, private route: ActivatedRoute, private af: AngularFire, private storyService: StoryService) {
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
				if (object.$value !== null) {
					this.storylocation = object.location;
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
				} else {
					this.router.navigate(['404']);
				}

			}
		);

	}

	ngOnInit() {
		this.spinner.stop();
	}



}
