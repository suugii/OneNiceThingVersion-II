import { Component, OnInit } from '@angular/core';
import { AuthService } from "./../../service/auth.service";

@Component({
	selector: 'app-change-password',
	templateUrl: './change-password.component.html',
	styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {
	message: any;
	classCondition: boolean;
	userdata: any;
	constructor(private authService: AuthService) {
		this.authService.af.auth.subscribe(
			(data) => {
				if (data) {
					this.userdata = data;
				}
			}
		);
	}

	ngOnInit() {
	}

	updatePassword(event, password, currentpass) {
		event.preventDefault();
		this.authService.reauthenticateUser(this.userdata.auth.email,currentpass).then(() => {
			this.authService.updateUserPassword(password).then(() => {
				this.classCondition = true;
				this.message = 'Succesfully changed your password';
			}).catch(error => {
				if (error) {
					this.classCondition = false;
					this.message = error.message;
				}
			})
		}).catch(error => {
			if (error) {
				this.classCondition = false;
				this.message = error.message;
			}
		})

	}
}
