import { Component, OnInit } from '@angular/core';
import { AfService } from "../../providers/af.service";
import { Router, ActivatedRoute } from "@angular/router";
import { User } from '../register-page/user';
import { AngularFire, FirebaseObjectObservable } from 'angularfire2';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent implements OnInit {
  public error: any;
  public returnUrl: string;
  public user = new User();
  public currentuser: FirebaseObjectObservable<any>;
  constructor(private route: ActivatedRoute, public afService: AfService, private router: Router) { }

  ngOnInit() {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  loginWithGoogle() {
    this.afService.loginWithGoogle().then((data) => {
      this.router.navigate([this.returnUrl]);
    })
      .catch((error: any) => {
        if (error) {
          this.error = error;
        }
      });
  }


  loginWithEmail(event, email, password) {
    event.preventDefault();
    this.afService.loginWithEmail(email, password).then(() => {
      this.router.navigate([this.returnUrl]);
    })
      .catch((error: any) => {
        if (error) {
          this.error = error;
        }
      });
  }

  loginWithGuest() {
    this.afService.loginWithGuest().then((data) => {
      delete this.user.password;
      this.afService.saveUserInfoFromForm(data.uid, this.user).then(() => {
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
    this.afService.loginWithFacebook().then((data) => {
      console.log(data);
      var test = this.afService.getUser(data.uid);
      console.log(this.currentuser);
      // this.router.navigate([this.returnUrl]);
    })
      .catch((error: any) => {
        if (error) {
          this.error = error;
        }
      });
  }
}
