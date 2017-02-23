import { Component, OnInit } from '@angular/core';
import { AfService } from "../../providers/af.service";
import { Router, ActivatedRoute, Params } from '@angular/router';
import * as firebase from 'firebase';

@Component({
  selector: 'app-confirmpassword-page',
  templateUrl: './confirmpassword-page.component.html',
  styleUrls: ['./confirmpassword-page.component.css']
})
export class ConfirmpasswordPageComponent implements OnInit {
  public message: any;
  public oobCode: any;
  public error: any;
  constructor(private afService: AfService, private activatedRoute: ActivatedRoute, private router: Router) {
    this.afService.logout();
  }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe((params: Params) => {
      this.oobCode = params['oobCode'];
      firebase.auth().checkActionCode(this.oobCode).then(() => {
        console.log('success');
      })
        .catch((error) => {
          if (error) {
            this.router.navigate(['']);
          }
        })
    });
  }

  onSubmit(formData) {
    if (formData.valid) {
      this.afService.updatePassword(this.oobCode, formData.value.password)
        .then((response) => {
          this.message = 'Successfully';
        })
        .catch((error) => {
          this.error = error;
        })
    }
  }
}
