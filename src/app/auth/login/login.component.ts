import { Component, OnInit } from '@angular/core';
import { AuthService } from "./../../service/auth.service";
import { Router, ActivatedRoute } from "@angular/router";
import { User } from './../../class/user';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

    public error: any;
    public returnUrl: string;
    public user = new User();
    constructor(private route: ActivatedRoute, public authService: AuthService, private router: Router) { }

    ngOnInit() {
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    }

    loginWithGoogle() {
        this.authService.loginWithGoogle().then((data) => {
            var userdata = this.authService.getUser(data.uid);
            userdata.subscribe(snapshot => {
                if (snapshot.$exists()) {
                    this.router.navigate([this.returnUrl]);
                } else {
                    delete this.user.password;
                    this.user.email = data.auth.email;
                    this.user.photoURL = data.auth.photoURL;
                    this.user.username = data.auth.displayName;
                    this.authService.saveUserInfoFromForm(data.uid, this.user).then(() => {
                        this.router.navigate([this.returnUrl]);
                    })
                        .catch((error) => {
                            this.error = error;
                        });
                }
            });
        })
            .catch((error: any) => {
                if (error) {
                    this.error = error;
                }
            });
    }


    loginWithEmail(event, email, password) {
        event.preventDefault();
        this.authService.loginWithEmail(email, password).then(() => {
            this.router.navigate([this.returnUrl]);
        })
            .catch((error: any) => {
                if (error) {
                    this.error = error;
                }
            });
    }

    loginWithGuest() {
        this.authService.loginWithGuest().then((data) => {
            delete this.user.password;
            this.authService.saveUserInfoFromForm(data.uid, this.user).then(() => {
                this.router.navigate([this.returnUrl]);
            })
                .catch((error) => {
                    this.error = error;
                });
        })
            .catch((error: any) => {
                if (error) {
                    this.error = error;
                }
            });
    }

    loginWithFacebook() {
        this.authService.loginWithFacebook().then((data) => {
            var userdata = this.authService.getUser(data.uid);
            userdata.subscribe(snapshot => {
                if (snapshot.$exists()) {
                    this.router.navigate([this.returnUrl]);
                } else {
                    delete this.user.password;
                    this.user.email = data.auth.email;
                    this.user.photoURL = data.auth.photoURL;
                    this.user.username = data.auth.displayName;
                    this.authService.saveUserInfoFromForm(data.uid, this.user).then(() => {
                        this.router.navigate([this.returnUrl]);
                    })
                        .catch((error) => {
                            this.error = error;
                        });
                }
            });
        })
            .catch((error: any) => {
                if (error) {
                    this.error = error;
                }
            });
    }

}