// auth.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:5000/login'; // Stellen Sie sicher, dass die URL korrekt ist
  private userSubject = new BehaviorSubject<any>(null);

  constructor(private http: HttpClient) {}

  // Login-Methode, die die Anmeldeanfrage an den Server sendet
  login(name: string, email: string): Observable<any> {
    return this.http.post(this.apiUrl, { name, email });
  }

  // Speichert die Benutzerinformationen, einschließlich der Rolle
  setUser(user: any) {
    this.userSubject.next(user);
  }

  // Gibt ein Observable zurück, um den Benutzer zu abonnieren
  getUser(): Observable<any> {
    return this.userSubject.asObservable();
  }

  // Meldet den Benutzer ab
  logout() {
    this.userSubject.next(null);
  }

  // Überprüft, ob der Benutzer angemeldet ist
  isLoggedIn(): boolean {
    return this.userSubject.getValue() !== null;
  }

  // Gibt die Rolle des angemeldeten Benutzers zurück
  getUserRole(): string | null {
    const user = this.userSubject.getValue();
    return user ? user.role : null;
  }

  // Überprüft, ob der Benutzer die erwartete Rolle hat
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
