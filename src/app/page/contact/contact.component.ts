import { Component, OnInit } from '@angular/core';
import { AngularFire, FirebaseListObservable } from 'angularfire2';
import { Contact } from './../../class/contact';

@Component({
	selector: 'app-contact',
	templateUrl: './contact.component.html',
	styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {

    model: Contact = new Contact();
    public error: any;
    public success: any;

    constructor(private af: AngularFire) { }

    ngOnInit() { }

    storeContact() {
        this.af.database.list('feeds').push(this.model).then(()=>{
            this.success = 'Successfully added';
        }).catch((error: any) => {
            this.error = error;
        });
        this.model = new Contact();
    }

}