import { Component, OnInit } from '@angular/core';
import { AuthService } from "./../../service/auth.service";

@Component({
	selector: 'app-passwordreset',
	templateUrl: './passwordreset.component.html',
	styleUrls: ['./passwordreset.component.css']
})
export class PasswordresetComponent implements OnInit {

	public message: any;
	
	constructor(private authService: AuthService) { }

	ngOnInit() {
	}

	onSubmit(formData) {
		if (formData.valid) {
			this.authService.resetPassword(formData.value.email).then((response) => {
				this.message = 'Check your email for reset link';
			}).catch((error) => {
				this.message = error;
			})
		}
	}

}
