import { Component, OnInit } from '@angular/core';
import { AngularFire, FirebaseListObservable } from 'angularfire2';
import { StoryService } from "../../service/story.service";
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import "rxjs/add/operator/map";

@Component({
	selector: 'app-user-stories',
	templateUrl: './user-stories.component.html',
	styleUrls: ['./user-stories.component.css']
})
export class UserStoriesComponent implements OnInit {

	objects: FirebaseListObservable<any[]>;
	favorites: FirebaseListObservable<any[]>;
	limit: BehaviorSubject<number> = new BehaviorSubject<number>(6);
	lastKey: string;
	queryable: boolean = true;
	counter: number = 0;
	favorited: boolean = false;
	user: string;
	stories: any[];
	isCounter: boolean;
	constructor(private af: AngularFire, private storyService: StoryService) {
		this.af.auth.subscribe(
			(auth) => {
				if (auth) {
					this.user = auth.uid;
				}
			}
		);

		this.af.database.list('/stories', {
			query: {
				orderByChild: 'user',
				equalTo: this.user,
				limitToFirst: 1,
			}
		}).subscribe((data) => {
			if (data.length > 0) {
				this.lastKey = data[0].$key;
			} else {
				this.lastKey = '';
			}
		});

		this.objects = this.af.database.list('stories', {
			query: {
				orderByChild: 'user',
				equalTo: this.user,
				limitToLast: this.limit,
			}
		}).map((array) => array.reverse()) as FirebaseListObservable<any[]>;

		this.objects.subscribe((data) => {
			if (data.length > 0) {
				if (data[data.length - 1].$key === this.lastKey) {
					this.queryable = false;
				} else {
					this.queryable = true;
				}
			}
		});


		this.objects.subscribe(
			dataStory => {
				this.isCounter = false;
				if (dataStory.length == 0) {
					this.isCounter = true;
				}
				dataStory.forEach(
					story => {
						this.favorites = this.af.database.list('favorites', {
							query: {
								orderByChild: 'sid',
								equalTo: story.$key
							}
						});
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
								story.favorite = this.counter;
								this.counter = 0;
								story.favorited = this.favorited;
								this.favorited = false;
							}
						)
						story.user = this.af.database.object('users' + '/' + story.user);
					}
				)
				this.stories = dataStory;
			}
		);
	}

	ngOnInit() { }

	destroyStory(key: string) {
		this.af.database.list('stories').remove(key);
		this.af.database.list('favorites', {
			query: {
				orderByChild: 'sid',
				equalTo: key
			}
		}).remove();
	}


	scrolled(): void {
		if (this.queryable) {
			this.limit.next(this.limit.getValue() + 6);
		}
	}
}