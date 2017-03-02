import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { AngularFire, FirebaseObjectObservable } from 'angularfire2';
import { Story } from './../../class/story';

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

	constructor(private router: Router, private route: ActivatedRoute, private af: AngularFire) {
		this.story = this.af.database.object('stories' + '/' + this.key);
        this.story.subscribe(
            (story) => {
				this.model.user = story.user;
				this.model.touser = story.touser;
				this.model.location = story.location;
				this.model.story = story.story;
				this.model.name = story.name;
				this.model.feeling = story.feeling;
				this.model.message = story.message;
				this.model.privacy = story.privacy;
				this.model.created_at = story.created_at;
            }
        );
    }

	ngOnInit() { }

    updateStory() {
        this.story.update(this.model).then(()=>{
            this.success = 'Successfully updated';
        }).catch((error: any) => {
            this.error = error;
        });
    }

}