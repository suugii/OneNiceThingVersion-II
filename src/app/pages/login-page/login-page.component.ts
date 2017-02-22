import { Component, OnInit } from '@angular/core';
import { AfService } from "../../providers/af.service";
import { Router } from "@angular/router";

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent implements OnInit {
  public error: any;
  constructor(public afService: AfService, private router: Router) { }

  ngOnInit() {
  }

  loginWithGoogle() {
    this.afService.loginWithGoogle().then((data) => {
      this.router.navigate(['']);
    })
      .catch((error: any) => {
        if (error) {
          this.error = error;
          console.log(this.error);
        }
      });
  }


  loginWithEmail(event, email, password) {
    event.preventDefault();
    this.afService.loginWithEmail(email, password).then(() => {
      this.router.navigate(['']);
    })
      .catch((error: any) => {
        if (error) {
          this.error = error;
          console.log(this.error);
        }
      });
  }

  loginWithGuest() {
    this.afService.loginWithGuest().then((data) => {
      this.router.navigate(['']);
      console.log(data);
    })
      .catch((error: any) => {
        if (error) {
          this.error = error;
          console.log(this.error);
        }
      });
  }

  loginWithFacebook() {
    this.afService.loginWithFacebook().then((data) => {
      this.router.navigate(['']);
    })
      .catch((error: any) => {
        if (error) {
          this.error = error;
          console.log(this.error);
        }
      });
  }
}
