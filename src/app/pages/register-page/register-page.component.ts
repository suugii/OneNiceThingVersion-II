import { Component, OnInit } from '@angular/core';
import { AfService } from "../../providers/af.service";
import { Router } from "@angular/router";
import { User } from './user';
@Component({
  selector: 'app-register-page',
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.css']
})
export class RegisterPageComponent implements OnInit {
  public error: any;
  public user = new User();
  constructor(private afService: AfService, private router: Router) { }

  ngOnInit() {
  }

  registerUser(event) {

    event.preventDefault();
    this.afService.registerUser(this.user.email, this.user.password).then((user) => {
      delete this.user.password;
      this.afService.saveUserInfoFromForm(user.uid, this.user).then(() => {
        this.router.navigate(['']);
      })
        .catch((error) => {
          this.error = error;
        });
    })
      .catch((error) => {
        this.error = error;
      });
  }

}
