import { Component, OnInit } from '@angular/core';
import { AngularFire, FirebaseListObservable } from 'angularfire2';
import { StoryService } from "../../service/story.service";
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import "rxjs/add/operator/map";

@Component({
	selector: 'app-user-originate',
	templateUrl: './user-originate.component.html',
	styleUrls: ['./user-originate.component.css']
})
export class UserOriginateComponent implements OnInit {

	objects: FirebaseListObservable<any[]>;
	favorites: FirebaseListObservable<any[]>;

	subsstories: any;
	subsobjectsone: any;
	subsobjectstwo: any;
	counter: number = 0;
	user: string;
	stories: any[];
	favorited: boolean = false;
	isCounter: boolean;
	limit: BehaviorSubject<number> = new BehaviorSubject<number>(6);
	lastKey: string;
	queryable: boolean = true;

	constructor(private af: AngularFire, private storyService: StoryService) {
		this.af.auth.subscribe(
			(auth) => {
				if (auth) {
					this.user = auth.uid;
				}
			}
		);

		this.subsstories = this.af.database.list('/stories', {
			query: {
				orderByChild: 'touser',
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

		this.objects = this.af.database.list('stories', {
			query: {
				orderByChild: 'touser',
				equalTo: this.user,
				limitToLast: this.limit,
			}
		}).map((array) => array.reverse()) as FirebaseListObservable<any[]>;

		this.subsobjectsone = this.objects.subscribe((data) => {
			if (data.length > 0) {
				if (data[data.length - 1].$key === this.lastKey) {
					this.queryable = false;
				} else {
					this.queryable = true;
				}
			}
		});


		this.subsobjectstwo = this.objects.subscribe(
			dataStory => {
				this.isCounter = false;
				if (dataStory.length < 6) {
					this.queryable = false;
				}
				if (dataStory.length == 0) {
					this.isCounter = true;
					this.queryable = false;
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

	ngOnInit() {
	}

	ngOnDestroy() {
		this.subsstories.unsubscribe();
		this.subsobjectsone.unsubscribe();
		this.subsobjectstwo.unsubscribe();
	}

	scrolled(): void {
		if (this.queryable) {
			this.limit.next(this.limit.getValue() + 6);
		}
	}
}
