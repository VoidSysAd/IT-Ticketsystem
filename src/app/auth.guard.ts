import { Injectable } from '@angular/core';
import {
  CanActivate,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree
} from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | UrlTree {
    const expectedRole = route.data['expectedRole'];

    if (!this.authService.isLoggedIn()) {
      console.log('Benutzer ist nicht eingeloggt, Weiterleitung zu Login-Seite');
      return this.router.parseUrl('/login');
    }

    const userRole = this.authService.getUserRole();
    console.log(`Benutzerrolle: ${userRole}, Erwartete Rolle: ${expectedRole}`);

    if (expectedRole) {
      if (Array.isArray(expectedRole)) {
        // Prüfe, ob die Rolle des Benutzers in der erwarteten Rollen-Liste ist
        if (!expectedRole.includes(userRole || '')) {
          console.log('Benutzer hat keine Berechtigung, Weiterleitung zu Login-Seite');
          return this.router.parseUrl('/login');
        }
      } else {
        // Einzelne Rolle prüfen
        if (expectedRole !== userRole) {
          console.log('Benutzer hat keine Berechtigung, Weiterleitung zu Login-Seite');
          return this.router.parseUrl('/login');
        }
      }
    }

    return true;
  }
}
