import { Component } from '@angular/core';
import { AfService } from "./providers/af.service";
import { Router } from "@angular/router";
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  public isLoggedIn: any;
  constructor(public afService: AfService, private router: Router) {
    this.afService.af.auth.subscribe(
      (auth) => {
        if (auth) {
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
