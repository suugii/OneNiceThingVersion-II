import { Component, OnInit } from '@angular/core';
import { AuthService } from "./../../service/auth.service";
import { Router, ActivatedRoute } from "@angular/router";
import { User } from './../../class/user';

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

    public error: any;
    public user = new User();
    public returnUrl: string;
    constructor(private route: ActivatedRoute, private authService: AuthService, private router: Router) { }

    ngOnInit() {
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    }

    registerUser(event) {
        event.preventDefault();
        this.authService.registerUser(this.user.email, this.user.password).then((user) => {
            delete this.user.password;
            this.authService.saveUserInfoFromForm(user.uid, this.user).then(() => {
                this.router.navigate([this.returnUrl]);
            }).catch((error) => {
                this.error = error;
            });
        }).catch((error) => {
            this.error = error;
        });
    }
}