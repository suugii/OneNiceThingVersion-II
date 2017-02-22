import { Component, OnInit } from '@angular/core';
import { StoryService } from "../../providers/story.service";
import { AfService } from "../../providers/af.service";
import { FirebaseListObservable } from "angularfire2";
import { Story } from './story';

@Component({
    selector: 'app-add-story',
    templateUrl: './add-story.component.html',
    styleUrls: ['./add-story.component.css']
})
export class AddStoryComponent implements OnInit {
    public currentUid: any;
    public model = new Story();
    public users: FirebaseListObservable<any>;
    public error: any;
    public success: any;
    public icon: boolean = true;

    constructor(public storyService: StoryService, public afService: AfService) {
        this.users = this.afService.getUsers();
    }

    ngOnInit() { }

    addStory() {
        this.storyService.storeStory(this.model).then(()=>{
            this.success = 'Successfully added';
        }).catch((error: any) => {
            this.error = error;
        });
    }

}
