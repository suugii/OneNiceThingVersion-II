import { Component, OnInit } from '@angular/core';
import { AngularFire, FirebaseListObservable } from 'angularfire2';
import { Story } from './../../class/story';

@Component({
	selector: 'app-create',
	templateUrl: './create.component.html',
	styleUrls: ['./create.component.css']
})
export class CreateComponent implements OnInit {
    
    stories: FirebaseListObservable<any[]>;

    model: Story = new Story();

    public error: any;
    public success: any;

    constructor(private af: AngularFire) {
        this.stories = af.database.list('stories');

        this.af.auth.subscribe(
            (auth) => {
                if (auth) {
                    this.model.user = auth.uid;
                }
            }
        );
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