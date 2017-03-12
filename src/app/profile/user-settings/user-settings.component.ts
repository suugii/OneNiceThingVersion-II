import { Component, OnInit } from '@angular/core';
import { User } from './../../class/user';
import { AuthService } from "./../../service/auth.service";
import * as _ from 'lodash';
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
    public userData: any;
    constructor(private authService: AuthService) {
    }

    ngOnInit() {
        this.authService.af.auth.subscribe(
            (data) => {
                if (data) {
                    this.authService.getUser(data.uid).subscribe(snapshot => {
                        if (snapshot.$exists()) {
                            this.userData = snapshot;
                            this.user.username = snapshot.username;
                            this.user.firstname = snapshot.firstname;
                            this.user.lastname = snapshot.lastname;
                        }
                    });
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

    updateUser(event) {
        event.preventDefault();
        var userdata = this.authService.getUser(this.userData.$key).take(1);
        userdata.subscribe(snapshot => {
            if (snapshot.$exists()) {
                delete this.user.password;
                delete this.user.email;
                delete this.user.photoURL;
                delete this.user.location;
                delete this.user.created_at;
                var result = _.pickBy(this.user, _.identity);
                this.authService.updateUser(result, snapshot.$key).then(() => {
                    this.classCondition = true;
                    this.message = 'Succesfully Updated Your Account';
                }).catch(error => {
                    if (error) {
                        this.classCondition = false;
                        this.message = error.message;
                    }
                })
            }
        });
    }
}
