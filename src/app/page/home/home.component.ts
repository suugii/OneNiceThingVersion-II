import { Component, OnInit } from '@angular/core';
import { AngularFire, FirebaseListObservable } from 'angularfire2';
import { Story } from './../../class/story';

@Component({
	selector: 'app-home',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

    stories: FirebaseListObservable<any[]>;

    model: Story = new Story();
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
        this.model = new Story();
    }

}