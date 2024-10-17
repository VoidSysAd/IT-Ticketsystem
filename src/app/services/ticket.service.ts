// ticket.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TicketService {
  private apiUrl = 'http://localhost:5000/api/tickets'; // Passen Sie die URL an

  constructor(private http: HttpClient) {}

  getTickets(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl).pipe(
      map((tickets) =>
        tickets.map((ticket) => {
          return { ...ticket, id: ticket._id }; // Mapping von _id zu id
        })
      )
    );
  }

  updateTicket(ticketId: string, ticketData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${ticketId}`, ticketData);
  }

  createTicket(ticketData: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, ticketData);
  }

  addComment(ticketId: string, commentData: any): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/${ticketId}/comments`,
      commentData
    );
  }
}
