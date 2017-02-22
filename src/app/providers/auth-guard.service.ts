import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AfService } from "./af.service";
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/take';

@Injectable()
export class AuthGuardService implements CanActivate {
  public
  constructor(private router: Router, public afService: AfService) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.afService.af.auth.map((auth) => {
      if (!auth) {
        this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
        return false;
      }
      return true;
    }).take(1);
  }
}
