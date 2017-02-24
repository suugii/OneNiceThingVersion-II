import { Component, OnInit } from '@angular/core';
import { User } from './../../class/user';
import { AuthService } from "./../../service/auth.service";
@Component({
    selector: 'app-user-settings',
    templateUrl: './user-settings.component.html',
    styleUrls: ['./user-settings.component.css']
})
export class UserSettingsComponent implements OnInit {
    public user = new User();
    public message: any;
    public classCondition: boolean;
    public isAnonymous: boolean;
    constructor(private authService: AuthService) {
    }

    ngOnInit() {
        this.authService.af.auth.subscribe(
            (data) => {
                if (data) {
                    if (data.auth.isAnonymous == true) {
                        this.isAnonymous = true;
                    }
                    else {
                        this.isAnonymous = false;
                    }
                }
            }
        );
    }

    upgradeUser(event) {
        event.preventDefault();
        this.authService.anonymousToPermanent(this.user).then((data) => {
            if (data) {
                this.message = 'Succesfully Upgraded Your Account';
                this.classCondition = true;
                delete this.user.password;
                this.authService.saveUserInfoFromForm(data.uid, this.user).then(() => {
                }).catch((error) => {
                    if (error) {
                        this.classCondition = false;
                        this.message = error.message;
                    }
                });
            }
        }).catch(error => {
            if (error) {
                this.classCondition = false;
                this.message = error.message;
            }
        })
    }
}
