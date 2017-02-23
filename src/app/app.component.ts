import { Component } from '@angular/core';
import { AfService } from "./providers/af.service";
import { Router } from "@angular/router";

declare var $: any;
@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
})
export class AppComponent {

    public isLoggedIn: any;
    public userdata: any;

    constructor(public afService: AfService, private router: Router) {
        this.afService.af.auth.subscribe(
            (auth) => {
                if (auth) {
                    this.userdata = auth;
                    this.isLoggedIn = true;
                }
                else {
                    this.isLoggedIn = false;
                }
            }
        );
    }

    logout() {
        var that = this;
        this.afService.logout().then(() => {
            that.router.navigate(['']);
        })
    }
    

}
