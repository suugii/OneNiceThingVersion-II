import { Component, OnInit } from '@angular/core';
import { AuthService } from "./../../service/auth.service";
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
	selector: 'app-change-password',
	templateUrl: './change-password.component.html',
	styleUrls: ['./change-password.component.css'],

})
export class ChangePasswordComponent implements OnInit {
	message: any;
	classCondition: boolean;
	userdata: any;
	public changepassForm: FormGroup;

	constructor(private authService: AuthService, private fb: FormBuilder) {
		this.authService.af.auth.subscribe(
			(data) => {
				if (data) {
					this.userdata = data;
				}
			}
		);
	}

	ngOnInit() {
		this.buildForm();

	}

	buildForm(): void {
		this.changepassForm = this.fb.group({
			'password': [null, [
				Validators.required,
			]],
			'newpassword': [null, [
				Validators.required,
				Validators.minLength(6),
			]],
			'confirmpassword': [null, [
				Validators.required,
			]],
		});
		this.changepassForm.valueChanges
			.subscribe(data => this.onValueChanged(data));
		this.onValueChanged();
	}



	onValueChanged(data?: any) {
		if (!this.changepassForm) { return; }
		const form = this.changepassForm;
		for (const field in this.formErrors) {
			this.formErrors[field] = '';
			const control = form.get(field);
			if (control && control.dirty && !control.valid) {
				const messages = this.validationMessages[field];
				for (const key in control.errors) {
					this.formErrors[field] += messages[key] + ' ';
				}
			}
		}
	}


	formErrors = {
		'password': '',
		'newpassword': '',
		'confirmpassword': '',
	};
	validationMessages = {
		'password': {
			'required': 'Please enter your password.',
		},
		'newpassword': {
			'required': 'Please enter your password.',
			'minlength': 'Email must be at least 6 characters long.',
		},
		'confirmpassword': {
			'required': 'Please enter your password.',
			'pristine': 'Password mismatch',
		},
	};

	updatePassword(event, password, currentpass) {
		event.preventDefault();
		this.authService.reauthenticateUser(this.userdata.auth.email, currentpass).then(() => {
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
