import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { User } from './user.interface';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  private apiUrl = 'http://localhost:5000/api';

  constructor(private http: HttpClient) {}

  register(userData: Partial<User>): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/accounts`, userData).pipe(
      catchError(error => {
        console.error('Registration error:', error);
        alert('Registration failed. Please try again.');
        return throwError(error);
      })
    );
  }
}
