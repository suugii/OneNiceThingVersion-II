import { Component, OnInit } from '@angular/core';
import { AngularFire, FirebaseListObservable } from 'angularfire2';
import { Contact } from './contact';

@Component({
	selector: 'app-contact-page',
	templateUrl: './contact-page.component.html',
	styleUrls: ['./contact-page.component.css']
})
export class ContactPageComponent implements OnInit {

    public model = new Contact();
    public error: any;
    public success: any;

    constructor(public af: AngularFire) { }

    ngOnInit() { }

    storeStory() {
        this.af.database.list('contact').push(this.model).then(()=>{
            this.success = 'Successfully added';
        }).catch((error: any) => {
            this.error = error;
        });
    }

}