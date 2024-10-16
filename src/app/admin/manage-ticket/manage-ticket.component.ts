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
  newCommentContent: string = '';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadTickets();
  }

  loadTickets() {
    this.http.get<any[]>('http://localhost:5000/api/tickets').subscribe(
      (data) => {
        this.offeneTickets = data.filter(ticket => ticket.status === 'offen');
        this.geschlosseneTickets = data.filter(ticket => ticket.status === 'geschlossen');
      },
      (error) => {
        console.error('Fehler beim Laden der Tickets:', error);
      }
    );
  }

  selectTicket(ticket: any) {
    this.selectedTicket = ticket;
  }

  addComment() {
    if (this.newCommentContent.trim() === '') {
      return;
    }

    const commentData = { inhalt: this.newCommentContent };
    this.http.post(`http://localhost:5000/api/tickets/${this.selectedTicket.id}/comments`, commentData).subscribe(
      (response: any) => {
        if (!this.selectedTicket.kommentare) {
          this.selectedTicket.kommentare = [];
        }
        this.selectedTicket.kommentare.push(response.comment);
        this.newCommentContent = ''; // Textfeld zurücksetzen
      },
      (error) => {
        console.error('Fehler beim Hinzufügen des Kommentars:', error);
      }
    );
  }

  toggleTicketStatus() {
    const newStatus = this.selectedTicket.status === 'offen' ? 'geschlossen' : 'offen';
    this.http.put(`http://localhost:5000/api/tickets/${this.selectedTicket.id}`, { status: newStatus }).subscribe(
      () => {
        this.selectedTicket.status = newStatus;
        if (newStatus === 'geschlossen') {
          this.selectedTicket.schlussdatum = new Date().toISOString();
        } else {
          this.selectedTicket.schlussdatum = null;
        }
        this.loadTickets(); // Aktualisiere die Listen der offenen und geschlossenen Tickets
      },
      (error) => {
        console.error('Fehler beim Aktualisieren des Ticketstatus:', error);
      }
    );
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
