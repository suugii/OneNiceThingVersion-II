import { Component, OnInit } from '@angular/core';
import { AngularFire, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2';
import { StoryService } from "../../service/story.service";
import * as _ from 'lodash';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import "rxjs/add/operator/map";

@Component({
	selector: 'app-user-favorites',
	templateUrl: './user-favorites.component.html',
	styleUrls: ['./user-favorites.component.css']
})
export class UserFavoritesComponent implements OnInit {

	favorites: FirebaseListObservable<any[]>;
	storyFavorites: FirebaseListObservable<any[]>;
	story: FirebaseObjectObservable<any>;
	limit: BehaviorSubject<number> = new BehaviorSubject<number>(6);
	lastKey: string;
	queryable: boolean = true;
	stories: any[];
	counter: number = 0;
	favorited: boolean = false;
	user: string;
	isCounter: boolean;
	constructor(public af: AngularFire, private storyService: StoryService) {
		this.af.auth.subscribe(
			(auth) => {
				if (auth) {
					this.user = auth.uid;
				}
			}
		);

		this.af.database.list('/favorites', {
			query: {
				orderByChild: 'uid',
				equalTo: this.user,
				limitToFirst: 1
			}
		}).subscribe((data) => {
			if (data.length > 0) {
				this.lastKey = data[0].$key;
			} else {
				this.lastKey = '';
			}
		});


		this.favorites = this.af.database.list('favorites', {
			query: {
				orderByChild: 'uid',
				equalTo: this.user,
				limitToLast: this.limit,
			}
		}).map((array) => array.reverse()) as FirebaseListObservable<any[]>;


		this.favorites.subscribe((data) => {
			if (data.length > 0) {
				if (data[data.length - 1].$key === this.lastKey) {
					this.queryable = false;
				} else {
					this.queryable = true;
				}
			}
			if (data.length < 6) {
				this.queryable = false;
			}
		});


		this.favorites.subscribe(
			dataFav => {
				this.stories = [];
				this.isCounter = false;
				if (dataFav.length == 0) {
					this.isCounter = true;
					this.queryable = false;
				}
				dataFav.forEach(
					favorite => {
						this.story = this.af.database.object('stories' + '/' + favorite.sid);
						this.story.subscribe(
							object => {

								this.storyFavorites = this.af.database.list('favorites', {
									query: {
										orderByChild: 'sid',
										equalTo: object.$key
									}
								});
								this.storyFavorites.subscribe(
									storyDataFav => {
										storyDataFav.forEach(
											storyFavorite => {
												this.counter = this.counter + 1;
												if (storyFavorite.uid == this.user) {
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
								this.stories.push(object);
							}
						);
					}
				)
			}
		);

	}

	scrolled(): void {
		if (this.queryable) {
			this.limit.next(this.limit.getValue() + 6);
		}
	}

	ngOnInit() { }

}
