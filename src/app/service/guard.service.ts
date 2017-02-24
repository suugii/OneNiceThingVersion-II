import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from "./auth.service";
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/take';

@Injectable()
export class GuardService implements CanActivate {

	constructor(private router: Router, public AuthService: AuthService) { }

	canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
		return this.AuthService.af.auth.map((auth) => {
			if (!auth) {
				this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
				return false;
			}
			return true;
		}).take(1);
	}

}
