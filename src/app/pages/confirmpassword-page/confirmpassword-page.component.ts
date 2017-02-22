import { Component, OnInit } from '@angular/core';
import { AfService } from "../../providers/af.service";
import { Router, ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-confirmpassword-page',
  templateUrl: './confirmpassword-page.component.html',
  styleUrls: ['./confirmpassword-page.component.css']
})
export class ConfirmpasswordPageComponent implements OnInit {
  public message: any;
  public oobCode: any;
  constructor(private afService: AfService, private activatedRoute: ActivatedRoute) {
    this.afService.logout();
  }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe((params: Params) => {
      this.oobCode = params['oobCode'];
    });
  }

  onSubmit(formData) {
    if (formData.valid) {
      this.afService.updatePassword(this.oobCode,formData.value.password)
        .then((response) => {
          console.log('Sent successfully');
          this.message = 'successfully';
        })
        .catch((error) => {
          this.message = error;
          console.log(error);
        })
    }
  }
}
