// account.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from './user.interface';  // Importiere das User-Interface

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  private apiUrl = 'http://localhost:5000/api';  // Die API-URL mit '/api'

  constructor(private http: HttpClient) {}

  // Registrierung eines neuen Benutzers
  register(userData: Partial<User>): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/accounts`, userData);  // Korrekte URL
  }
}
