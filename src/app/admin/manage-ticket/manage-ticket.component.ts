import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-manage-ticket',
  templateUrl: './manage-ticket.component.html',
  standalone: true,
  imports: [FormsModule, CommonModule]
})
export class ManageTicketComponent implements OnInit {
  offeneTickets: any[] = [];
  geschlosseneTickets: any[] = [];
  selectedTicket: any = null;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadTickets();
  }

  loadTickets() {
    this.http.get<any[]>('http://localhost:5000/api/tickets').subscribe(
      (data) => {
        // Tickets in offene und geschlossene Tickets aufteilen
        this.offeneTickets = data.filter(ticket => ticket.status === 'offen');
        this.geschlosseneTickets = data.filter(ticket => ticket.status === 'geschlossen');
      },
      (error) => {
        console.error('Fehler beim Laden der Tickets:', error);
      }
    );
  }

  selectTicket(ticket: any) {
    this.selectedTicket = ticket; // Ticket auswählen, um die Details anzuzeigen
  }

  getLevelDescription(level: string): string {
    switch (level) {
      case '1':
        return 'Normal';
      case '2':
        return 'Dringend';
      case '3':
        return 'Kritisch';
      default:
        return 'Unbekannt';
    }
  }
}

