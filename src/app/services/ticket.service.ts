import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TicketService {
  private apiUrl = 'http://localhost:5000/tickets'; // Passen Sie die URL an

  constructor(private http: HttpClient) {}

  getTickets(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  updateTicket(ticketId: string, ticketData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${ticketId}`, ticketData);
  }
  createTicket(ticketData: any): Observable<any> {
    return this.http.post(this.apiUrl, ticketData);
  }
  
}
