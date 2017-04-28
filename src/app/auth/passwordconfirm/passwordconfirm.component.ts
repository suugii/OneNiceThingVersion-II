import { Component, OnInit } from '@angular/core';
import { AuthService } from "./../../service/auth.service";
import { Router, ActivatedRoute, Params } from '@angular/router';
import * as firebase from 'firebase';

@Component({
	selector: 'app-passwordconfirm',
	templateUrl: './passwordconfirm.component.html',
	styleUrls: ['./passwordconfirm.component.css']
})
export class PasswordconfirmComponent implements OnInit {

	public message: any;
	public password: any;
	public oobCode: any;
	public error: any;
	constructor(private authService: AuthService, private activatedRoute: ActivatedRoute, private router: Router) {
		this.authService.logout();
	}

	ngOnInit() {
		this.activatedRoute.queryParams.subscribe((params: Params) => {
			this.oobCode = params['oobCode'];
			firebase.auth().checkActionCode(this.oobCode).then(() => {
				//
			}).catch((error) => {
				if (error) {
					this.router.navigate(['']);
				}
			})
		});
	}

	onSubmit(formData) {
		if (formData.valid) {
			this.authService.updatePassword(this.oobCode, formData.value.password).then((response) => {
				this.message = 'Successfully';
			}).catch((error) => {
				this.error = error;
			})
		}
	}

}
