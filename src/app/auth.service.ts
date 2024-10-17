// auth.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:5000/login'; // Passen Sie die URL an Ihr Backend an
  private userSubject = new BehaviorSubject<any>(null);

  constructor(private http: HttpClient) {}

  login(name: string, email: string): Observable<any> {
    return this.http.post(this.apiUrl, { name, email });
  }

  setUser(user: any) {
    this.userSubject.next(user);
  }

  getUser(): Observable<any> {
    return this.userSubject.asObservable();
  }

  logout() {
    this.userSubject.next(null);
  }

  // Neue Methode: Überprüfen, ob der Benutzer angemeldet ist
  isLoggedIn(): boolean {
    return this.userSubject.getValue() !== null;
  }

  // Neue Methode: Gibt die Rolle des angemeldeten Benutzers zurück
  getUserRole(): string | null {
    const user = this.userSubject.getValue();
    return user ? user.role : null;
  }
  // auth.service.ts

// ... Ihr bestehender Code ...

  hasRole(expectedRole: string | string[]): boolean {
    const user = this.userSubject.getValue();
    if (!user || !user.role) {
      return false;
    }

    if (Array.isArray(expectedRole)) {
      return expectedRole.includes(user.role);
    } else {
      return user.role === expectedRole;
    }
  }

}
