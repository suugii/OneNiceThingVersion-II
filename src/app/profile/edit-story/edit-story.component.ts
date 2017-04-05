import { Component, OnInit, ElementRef, AfterViewInit, NgZone, ViewChild, Inject } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { AngularFire, FirebaseObjectObservable } from 'angularfire2';
import { Story } from './../../class/story';
import { MapsAPILoader } from 'angular2-google-maps/core';
import { AuthService } from "./../../service/auth.service";
import * as _ from 'lodash';
import { DomSanitizer, SafeHtml } from "@angular/platform-browser";
import { ImageResult, ResizeOptions } from 'ng2-imageupload';
import * as firebase from 'firebase';
import { ImageCropperComponent, CropperSettings, Bounds } from 'ng2-img-cropper';

@Component({
	selector: 'app-edit-story',
	templateUrl: './edit-story.component.html',
	styleUrls: ['./edit-story.component.css']
})
export class EditStoryComponent implements OnInit, AfterViewInit {

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

	data: any;

	cropperSettings: CropperSettings;

	croppedWidth: number;
	croppedHeight: number;

	@ViewChild('cropper', undefined)
	cropper: ImageCropperComponent;

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
				this.model.image64 = story.image64;
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

		this.data = {};
	}

	ngAfterViewInit() {
		if (this.model.image64) {
			let imgObj = new Image();
			imgObj.src = this.model.image64;
			this.cropper.setImage(imgObj);
		}
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
		this.cropperSettings = new CropperSettings();
		this.cropperSettings.fileType = "image/jpeg";

		this.cropperSettings.width = 300;
		this.cropperSettings.height = 200;

		this.cropperSettings.croppedWidth = 300;
		this.cropperSettings.croppedHeight = 200;

		this.cropperSettings.canvasWidth = 300;
		this.cropperSettings.canvasHeight = 200;

		this.cropperSettings.rounded = false;
		this.cropperSettings.keepAspect = true;

		this.cropperSettings.noFileInput = true;
		this.cropperSettings.cropperDrawSettings.strokeColor = 'rgba(0,0,0,0.5)';
		this.cropperSettings.cropperDrawSettings.strokeWidth = 1;
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

	cropped(bounds: Bounds) {
		this.croppedHeight = bounds.bottom - bounds.top;
		this.croppedWidth = bounds.right - bounds.left;
		this.model.image64 = this.data.image;
		this.uploadImage(this.data.image);
	}

	fileChangeListener($event) {
		let image: any = new Image();;

		let file = $event.target.files[0];
		let myReader: FileReader = new FileReader();
		let that = this;
		myReader.onloadend = function (loadEvent: any) {
			that.cropper.reset();
			image.src = loadEvent.target.result;
			that.cropper.setImage(image);
		};
		myReader.readAsDataURL(file);
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