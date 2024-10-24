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

  // Erstelle ein Ticket (JSON Daten werden gesendet)
  createTicket(ticketData: Partial<Ticket>): Observable<any> {
    return this.http.post(this.apiUrl, ticketData);  // Korrekte URL und JSON-Daten
  }

  // Lade alle Tickets
  getTickets(): Observable<Ticket[]> {
    return this.http.get<Ticket[]>(this.apiUrl);  // Korrekte URL für alle Tickets
  }

  // Lade alle Benutzer
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>('http://localhost:5000/api/users');
  }

  // Weise ein Ticket einem Benutzer zu
  assignTicket(ticketId: string, userId: string): Observable<{ assigned_to: string }> {
    return this.http.put<{ assigned_to: string }>(
      `${this.apiUrl}/${ticketId}/assign`,  // URL korrekt angepasst
      { userId }
    );
  }

  // Kommentar zu einem Ticket hinzufügen
  addComment(ticketId: string, comment: { inhalt: string }): Observable<{ comment: any }> {
    return this.http.post<{ comment: any }>(
      `${this.apiUrl}/${ticketId}/comments`, 
      comment
    );
  }

  // Aktualisiere ein Ticket (z.B. Status oder Schlussdatum)
  updateTicket(ticketId: string, updateData: Partial<Ticket>): Observable<Ticket> {
    return this.http.put<Ticket>(
      `${this.apiUrl}/${ticketId}`,  // Korrekte URL
      updateData
    );
  }

  // Lösche ein Ticket
  deleteTicket(ticketId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${ticketId}`);
  }

  // Dateien zu einem Ticket hochladen (wenn du es benötigst)
  uploadFiles(ticketId: string, files: File[]): Observable<any> {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('files', file);
    });
    return this.http.post(`${this.apiUrl}/${ticketId}/attachments`, formData);
  }
  
  // Einzelnes Ticket abrufen
  getTicket(ticketId: string): Observable<Ticket> {
    return this.http.get<Ticket>(`${this.apiUrl}/${ticketId}`);
  }
}

// Re-export types
export type { Ticket } from '../interfaces/ticket.interface';
export type { User } from '../auth.service';
