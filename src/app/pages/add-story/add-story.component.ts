import { Component, OnInit } from '@angular/core';
import { AngularFire, FirebaseListObservable } from 'angularfire2';
import { Story } from './story';

@Component({
    selector: 'app-add-story',
    templateUrl: './add-story.component.html',
    styleUrls: ['./add-story.component.css']
})
export class AddStoryComponent implements OnInit {
    
    stories: FirebaseListObservable<any[]>;

    public model = new Story();
    public error: any;
    public success: any;

    constructor(public af: AngularFire) {
        this.stories = af.database.list('stories');
    }

    ngOnInit() { }

    storeStory() {
        this.stories.push(this.model).then(()=>{
            this.success = 'Successfully added';
        }).catch((error: any) => {
            this.error = error;
        });
    }

}