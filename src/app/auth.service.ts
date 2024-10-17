import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:5000/login'; // Passen Sie die URL an Ihren Backend-Endpunkt an
  private currentUser: any;

  constructor(private http: HttpClient) {}

  login(name: string, email: string): Observable<any> {
    return this.http.post(this.apiUrl, { name, email });
  }

  setUser(user: any) {
    this.currentUser = user;
  }

  getUser() {
    return this.currentUser;
  }

  isLoggedIn(): boolean {
    return !!this.currentUser;
  }

  logout() {
    this.currentUser = null;
  }

  hasRole(role: string): boolean {
    return this.currentUser && this.currentUser.role === role;
  }
}
