import { Component, OnInit } from '@angular/core';
import { AfService } from "../../providers/af.service";
import { Router, ActivatedRoute } from "@angular/router";
import { User } from './user';
@Component({
  selector: 'app-register-page',
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.css']
})
export class RegisterPageComponent implements OnInit {
  public error: any;
  public user = new User();
  public returnUrl: string;
  constructor(private route: ActivatedRoute, private afService: AfService, private router: Router) { }

  ngOnInit() {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  registerUser(event) {

    event.preventDefault();
    this.afService.registerUser(this.user.email, this.user.password).then((user) => {
      delete this.user.password;
      this.afService.saveUserInfoFromForm(user.uid, this.user).then(() => {
        this.router.navigate([this.returnUrl]);
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
