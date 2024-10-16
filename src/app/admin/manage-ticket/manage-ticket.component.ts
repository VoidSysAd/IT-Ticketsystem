import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-manage-ticket',
  templateUrl: './manage-ticket.component.html',
  standalone: true,
  imports: [FormsModule, CommonModule] // HttpClientModule wird nicht mehr benötigt
})
export class ManageTicketComponent implements OnInit {
  tickets: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadTickets();
  }

  loadTickets() {
    this.http.get<any[]>('http://localhost:5000/api/tickets').subscribe(
      (data) => {
        this.tickets = data.map(ticket => ({
          ...ticket,
          status: ticket.status || 'offen'
        }));
      },
      (error) => {
        console.error('Fehler beim Laden der Tickets:', error);
      }
    );
  }

  updateTicketStatus(ticket: any) {
    const updatedStatus = { status: ticket.status };
    this.http.put(`http://localhost:5000/api/tickets/${ticket.id}`, updatedStatus).subscribe(
      () => {
        console.log('Ticketstatus aktualisiert:', ticket.id);
        this.loadTickets(); // Nach der Aktualisierung die Tickets erneut laden
      },
      (error) => {
        console.error('Fehler beim Aktualisieren des Ticketstatus:', error);
      }
    );
  }

  deleteTicket(ticketId: string) {
    this.http.delete(`http://localhost:5000/api/tickets/${ticketId}`).subscribe(
      () => {
        this.tickets = this.tickets.filter(ticket => ticket.id !== ticketId);
      },
      (error) => {
        console.error('Fehler beim Löschen des Tickets:', error);
      }
    );
  }

  getLevelDescription(level: string): string {
    switch (level) {
      case '1':
        return 'normal';
      case '2':
        return 'Dringend';
      case '3':
        return 'Kritisch';
      default:
        return 'Unbekannt';
    }
  }
}
