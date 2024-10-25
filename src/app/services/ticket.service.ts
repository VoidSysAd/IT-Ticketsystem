import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import type { Ticket } from '../interfaces/ticket.interface';
import type { User } from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class TicketService {
  private apiUrl = 'http://localhost:5000/api/tickets';

  constructor(private http: HttpClient) {}

  // Erstelle ein Ticket
  createTicket(ticketData: Partial<Ticket>): Observable<any> {
    return this.http.post(`${this.apiUrl}`, ticketData);
}


  getTickets(): Observable<Ticket[]> {
    return this.http.get<Ticket[]>('http://localhost:5000/api/tickets');
  }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>('http://localhost:5000/api/users');
  }

  assignTicket(ticketId: string, userId: string): Observable<{ assigned_to: string }> {
    return this.http.put<{ assigned_to: string }>(
      `${this.apiUrl}/${ticketId}/assign`,  
      { userId }
    );
  }

  addComment(ticketId: string, comment: { inhalt: string, current_user: string }): Observable<{ comment: any }> {
    return this.http.post<{ comment: any }>(
      `${this.apiUrl}/${ticketId}/comments`, 
      comment
    );
  }

  updateTicket(ticketId: string, updateData: Partial<Ticket>): Observable<Ticket> {
    return this.http.put<Ticket>(
      `${this.apiUrl}/${ticketId}`,
      updateData
    );
  }

  deleteTicket(ticketId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${ticketId}`);
  }

  uploadFiles(ticketId: string, files: File[]): Observable<any> {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('files', file);
    });
    return this.http.post(`${this.apiUrl}/${ticketId}/attachments`, formData);
  }

  getTicket(ticketId: string): Observable<Ticket> {
    return this.http.get<Ticket>(`${this.apiUrl}/${ticketId}`);
  }
}
