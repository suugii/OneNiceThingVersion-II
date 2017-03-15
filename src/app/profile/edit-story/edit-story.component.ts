import { Component, OnInit, ElementRef, NgZone, ViewChild, Inject } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { AngularFire, FirebaseObjectObservable } from 'angularfire2';
import { Story } from './../../class/story';
import { MapsAPILoader } from 'angular2-google-maps/core';
import { AuthService } from "./../../service/auth.service";
import * as _ from 'lodash';
import { DomSanitizer, SafeHtml } from "@angular/platform-browser";
import { ImageResult, ResizeOptions } from 'ng2-imageupload';
import * as firebase from 'firebase';

@Component({
	selector: 'app-edit-story',
	templateUrl: './edit-story.component.html',
	styleUrls: ['./edit-story.component.css']
})
export class EditStoryComponent implements OnInit {

	key: any = this.route.snapshot.params['key'];

	story: FirebaseObjectObservable<any>;
	model: Story = new Story();
	public error: any;
	public success: any;
	@ViewChild("search")
	public searchElementRef: ElementRef;
	users: any[] = [];
	touser: any;
	location: any;
	src: string = "";
	resizeOptions: ResizeOptions = {
		resizeMaxHeight: 200,
		resizeMaxWidth: 300
	};
	public isProgressed: boolean;
	public storageRef: any = firebase.storage().ref();

	constructor(private router: Router, private route: ActivatedRoute, private _sanitizer: DomSanitizer, private authService: AuthService, private af: AngularFire, private mapsAPILoader: MapsAPILoader, private ngZone: NgZone) {
		this.story = this.af.database.object('stories' + '/' + this.key);

		this.story.subscribe(
			(story) => {
				this.model.user = story.user;
				this.location = story.location.name;
				this.model.location = story.location;
				this.model.story = story.story;
				this.model.name = story.name;
				this.model.feeling = story.feeling;
				this.model.message = story.message;
				this.model.privacy = story.privacy;
				this.model.created_at = story.created_at;
				this.authService.getUser(story.touser).subscribe((data) => {
					this.touser = data;
				})
			}
		);

		this.authService.getUsers().subscribe(datas => {
			var result = _.pickBy(_.reject(datas, { $key: this.model.user }), function (v, k) {
				if (v.email) {
					return v;
				}
			});
			this.users = _.toArray(result);
		});
	}

	ngOnInit() {
		this.mapsAPILoader.load().then(() => {
			let autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement);
			autocomplete.addListener("place_changed", () => {
				this.ngZone.run(() => {
					let place: google.maps.places.PlaceResult = autocomplete.getPlace();
					if (place.geometry === undefined || place.geometry === null) {
						return;
					}
					var obj = {
						latitude: null,
						longitude: null,
						name: null,
					};
					obj.latitude = place.geometry.location.lat();
					obj.longitude = place.geometry.location.lng();
					obj.name = place.formatted_address;
					this.model.location = obj;
				});
			});
		});
	}

	valueChanged(newVal) {
		this.touser = newVal;
		this.model.touser = newVal.$key;
	}
	selected(imageResult: ImageResult) {
		this.src = imageResult.resized
			&& imageResult.resized.dataURL
			|| imageResult.dataURL;
		this.uploadImage(this.src);
	}

	uploadImage(image) {
		this.isProgressed = true;
		var that = this;
		let path: string = 'image/' + Math.random().toString(36).substr(2, 9) + '.jpg';
		var files = image;
		let uploadTask: any = this.storageRef.child(path).putString(image, 'data_url');
		uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, function (snapshot) {
			var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
			console.log(progress);
			switch (snapshot.state) {
				case firebase.storage.TaskState.PAUSED: // or 'paused'
					console.log('Upload is paused');
					break;
				case firebase.storage.TaskState.RUNNING: // or 'running'
					console.log('Upload is running');
					break;
			}

		}, function (error) {
			switch (error.code) {
				case 'storage/unauthorized':
					// User doesn't have permission to access the object
					console.log(error);
					break;
				case 'storage/canceled':
					console.log(error);
					break;
				case 'storage/unknown':
					// Unknown error occurred, inspect error.serverResponse
					console.log(error);
					break;
			}
		}, function () {
			that.isProgressed = false;
			var downloadURL = uploadTask.snapshot.downloadURL;
			that.model.imageURL = downloadURL;
		});
	}


	autocompleListFormatter = (data: any): SafeHtml => {
		let html = `<span>${data.email}</span>`;
		return this._sanitizer.bypassSecurityTrustHtml(html);
	}


	updateStory() {
		this.story.update(this.model).then(() => {
			this.success = 'Successfully updated';
		}).catch((error: any) => {
			this.error = error;
		});
	}

}