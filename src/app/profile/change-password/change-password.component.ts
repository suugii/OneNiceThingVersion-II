import { Component, OnInit } from '@angular/core';
import { AuthService } from "./../../service/auth.service";

@Component({
	selector: 'app-change-password',
	templateUrl: './change-password.component.html',
	styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {

	constructor(private authService: AuthService) { }

	ngOnInit() {
	}

	updatePassword(event, password) {
		event.preventDefault();
		console.log(password);
	}
}
