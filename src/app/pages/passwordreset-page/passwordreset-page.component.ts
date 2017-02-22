import { Component, OnInit } from '@angular/core';
import { AfService } from "../../providers/af.service";

@Component({
  selector: 'app-passwordreset-page',
  templateUrl: './passwordreset-page.component.html',
  styleUrls: ['./passwordreset-page.component.css']
})

export class PasswordresetPageComponent implements OnInit {
  public message: any;
  constructor(private afService: AfService) { }

  ngOnInit() {
  }
  onSubmit(formData) {
    if (formData.valid) {
      this.afService.resetPassword(formData.value.email)
        .then((response) => {
          this.message = 'Check your email for reset link';
        })
        .catch((error) => {
          this.message = error;
          console.log(error);
        })
    }
  }
}
