import { Component, OnInit } from '@angular/core';
import { AuthService } from "./../../service/auth.service";
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
@Component({
	selector: 'app-passwordreset',
	templateUrl: './passwordreset.component.html',
	styleUrls: ['./passwordreset.component.css']
})
export class PasswordresetComponent implements OnInit {

	public message: any;
	public resetForm: FormGroup;
	public error: any;
	
	constructor(private authService: AuthService, private fb: FormBuilder, ) { }

	ngOnInit() {
		this.buildForm();
	}

	onSubmit(data) {
		this.authService.resetPassword(data).then((response) => {
			this.message = 'Check your email for reset link';
		}).catch((error) => {
			this.error = error;
		})
	}
	buildForm(): void {
		this.resetForm = this.fb.group({
			'email': [null, [Validators.required]],
		});
		this.resetForm.valueChanges
			.subscribe(data => this.onValueChanged(data));
		this.onValueChanged();
	}
	onValueChanged(data?: any) {
		if (!this.resetForm) { return; }
		const form = this.resetForm;
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
		'email': '',
	};
	validationMessages = {
		'email': {
			'required': 'Please enter your email.',
			'pattern': 'Email is required and format should be john@doe.com.',
		}
	};

}
