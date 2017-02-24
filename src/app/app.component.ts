import { Component } from '@angular/core';
import { AuthService } from "./service/auth.service";
import { Router } from "@angular/router";

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css']
})
export class AppComponent {
    public isLoggedIn: any;
    public userdata: any;
    
    constructor(public authService: AuthService, private router: Router) {
        this.authService.af.auth.subscribe(
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
        this.authService.logout().then(() => {
            that.router.navigate(['']);
        })
    }
}
