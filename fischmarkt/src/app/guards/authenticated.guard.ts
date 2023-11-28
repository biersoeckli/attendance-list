import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Observable } from "rxjs";
import * as Parse from 'parse';
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";

@Injectable()
export class CanActivateAuthenticated  {

  constructor(private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    return new Promise(async (resolve) => {
      try {
        const isLoggenId = !!(await Parse.User.current()?.fetch());
        if (!isLoggenId) {
          window.open(environment.attendanceListUrl ?? '/auth', '_self');
        } else {
          resolve(true);
        }
      } catch (ex) {
        console.error(ex);
        resolve(this.router.parseUrl('/'));
        Parse.User.logOut();
      }
    });
  }
}
