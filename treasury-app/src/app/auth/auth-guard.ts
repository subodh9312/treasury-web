import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, Router } from "@angular/router";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { AuthService } from "./auth.service";

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor (private authService: AuthService, private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | Promise<boolean> | Observable<boolean> {
    const allowedRoles = route.data.roles;

    if (this.authService.getRoles()) {
      const userRoles = this.authService.getRoles().map(role => role.context + "_" + role.permission);
      return this.authService.checkRoles(userRoles, allowedRoles);
    }

    return this.authService.getAuthRolesListener().pipe(map(res => {
      const userRoles = res.map(role => role.context + "_" + role.permission);
      return this.authService.checkRoles(userRoles, allowedRoles);
    }));
  }


}
