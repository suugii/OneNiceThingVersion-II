import { Component, OnInit } from '@angular/core';
import { AuthService } from "./../../service/auth.service";
import { Router, ActivatedRoute } from "@angular/router";
import { User } from './../../class/user';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ValidationService } from './../../service/validation.service';
@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

    public error: any;
    public returnUrl: string;
    public user = new User();
    public loginForm: FormGroup;

    constructor(private route: ActivatedRoute, private fb: FormBuilder, public authService: AuthService, private router: Router) { }

    ngOnInit() {
        this.buildForm();
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
            this.user.username = "Anonymous";
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

    buildForm(): void {
        this.loginForm = this.fb.group({
            'email': [null, [Validators.required]],
            'password': [null, [
                Validators.required,
                Validators.minLength(6),
            ]],
        });
        this.loginForm.valueChanges
            .subscribe(data => this.onValueChanged(data));
        this.onValueChanged();
    }
    onValueChanged(data?: any) {
        if (!this.loginForm) { return; }
        const form = this.loginForm;
        for (const field in this.formErrors) {
            this.formErrors[field] = '';
            const control = form.get(field);
            if (control && control.dirty && !control.valid) {
                const messages = this.validationMessages[field];
                for (const key in control.errors) {
                    this.formErrors[field] += messages[key] + ' ';
                }
            }
        }
    }
    formErrors = {
        'email': '',
        'password': '',
    };
    validationMessages = {
        'email': {
            'required': 'Please enter your email.',
            'pattern': 'Email is required and format should be john@doe.com.',
        },
        'password': {
            'required': 'Please enter your password.',
            'minlength': "Password must be at least 6 characters long."
        },
    };

}