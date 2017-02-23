import { Component, OnInit, AfterViewChecked, ElementRef, ViewChild } from '@angular/core';
import { AfService } from "../../providers/af.service";
import { FirebaseListObservable } from "angularfire2";
import { Story } from './story';

@Component({
	selector: 'app-home-page',
	templateUrl: './home-page.component.html',
	styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit {
    
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