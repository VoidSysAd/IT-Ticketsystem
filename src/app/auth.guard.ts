// auth.guard.ts

import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

// auth.guard.ts

// auth.guard.ts

canActivate(
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
): boolean | UrlTree {
  const expectedRoles = route.data['expectedRole'];

  if (!this.authService.isLoggedIn()) {
    // Benutzer ist nicht angemeldet
    return this.router.parseUrl('/login');
  }

  const userRole = this.authService.getUserRole();

  if (
    expectedRoles &&
    !expectedRoles.includes(userRole)
  ) {
    // Benutzer hat nicht die erforderliche Rolle
    alert(
      'Zugriff verweigert: Sie haben nicht die erforderlichen Berechtigungen.'
    );
    return false;
  }

  return true;
}

}
