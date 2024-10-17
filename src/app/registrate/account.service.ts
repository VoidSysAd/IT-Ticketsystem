import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private apiUrl = 'http://localhost:5000/accounts'; // Passen Sie die URL an Ihren Backend-Endpunkt an

  constructor(private http: HttpClient) {}

  registerAccount(accountData: any): Observable<any> {
    return this.http.post(this.apiUrl, accountData);
  }
}