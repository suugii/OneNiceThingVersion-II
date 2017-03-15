import { Component, OnInit } from '@angular/core';
import { AngularFire, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2';
import { StoryService } from "../../service/story.service";
import * as _ from 'lodash';

@Component({
	selector: 'app-user-favorites',
	templateUrl: './user-favorites.component.html',
	styleUrls: ['./user-favorites.component.css']
})
export class UserFavoritesComponent implements OnInit {

	favorites: FirebaseListObservable<any[]>;
	storyFavorites: FirebaseListObservable<any[]>;
	story: FirebaseObjectObservable<any>;

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
		this.favorites = this.af.database.list('favorites', {
			query: {
				orderByChild: 'uid',
				equalTo: this.user
			}
		});
		this.favorites.subscribe(
			dataFav => {
				this.isCounter = false;
				this.stories = [];
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
								console.log(object);
								object.user = this.af.database.object('users' + '/' + object.user);
								this.stories.push(object);
							}
						);

					}
				)
				if (this.stories.length == 0) {
					this.isCounter = true;
				}
			}
		);
	}

	ngOnInit() { }

}
