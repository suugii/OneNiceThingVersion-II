import { Component } from '@angular/core';
import { AfService } from "./providers/af.service";
import { Router } from "@angular/router";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  public isLoggedIn: boolean;
  constructor(public afService: AfService, private router: Router) {
    this.afService.af.auth.subscribe(
      (auth) => {
        if (auth == null) {
          console.log("Not Logged in.");
          this.isLoggedIn = false;
        }
        else {
          if (auth.google) {
            this.afService.displayName = auth.google.displayName;
            this.afService.email = auth.google.email;
            this.afService.authuid = auth.google.uid;
          }
          else if (auth.facebook) {
            this.afService.displayName = auth.facebook.displayName;
            this.afService.email = auth.facebook.email;
            this.afService.authuid = auth.facebook.uid;
          }
          else {
            this.afService.displayName = auth.auth.email;
            this.afService.email = auth.auth.email;
            this.afService.authuid = auth.auth.uid;
          }
          this.isLoggedIn = true;
          this.router.navigate(['']);
        }
      }
    );
  }

  logout() {
    var that = this;
    this.afService.logout().then(() => {
      that.router.navigate(['login']);
    })
  }

}
