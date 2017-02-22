import { Component, OnInit } from '@angular/core';
import { AfService } from "../../providers/af.service";
import { FirebaseListObservable } from "angularfire2";
import { Story } from './story';

@Component({
    selector: 'app-add-story',
    templateUrl: './add-story.component.html',
    styleUrls: ['./add-story.component.css']
})
export class AddStoryComponent implements OnInit {
    
    public model = new Story();
    public error: any;
    public success: any;

    constructor(public afService: AfService) { }

    ngOnInit() { }

    storeStory() {
        this.afService.af.database.list('stories').push(this.model).then(()=>{
            this.success = 'Successfully added';
        }).catch((error: any) => {
            this.error = error;
        });
    }

}
