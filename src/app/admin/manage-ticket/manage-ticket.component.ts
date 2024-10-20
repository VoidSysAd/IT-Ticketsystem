// manage-ticket.component.ts

import { Component, OnInit } from '@angular/core';
import { TicketService } from '../../services/ticket.service';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-manage-ticket',
  templateUrl: './manage-ticket.component.html',
  styleUrls: ['./manage-ticket.component.css'],
  standalone: true,
  imports: [FormsModule, CommonModule],
})
export class ManageTicketComponent implements OnInit {
  offeneTickets: any[] = [];
  geschlosseneTickets: any[] = [];
  selectedTicket: any = null;
  newCommentContent: string = '';

  constructor(private ticketService: TicketService, private http: HttpClient) {}

  ngOnInit() {
    this.loadTickets();
  }
  
  loadTickets() {
    this.ticketService.getTickets().subscribe(
      (data) => {
        console.log('Geladene Tickets:', data); // Fügen Sie diese Zeile hinzu
        this.offeneTickets = data
          .filter((ticket) => ticket.status === 'offen')
          .sort(
            (a, b) =>
              new Date(b.erstellungsdatum).getTime() -
              new Date(a.erstellungsdatum).getTime()
          );
  
        this.geschlosseneTickets = data
          .filter((ticket) => ticket.status === 'geschlossen')
          .sort(
            (a, b) =>
              new Date(b.erstellungsdatum).getTime() -
              new Date(a.erstellungsdatum).getTime()
          );
      },
      (error) => {
        console.error('Fehler beim Laden der Tickets:', error);
      }
    );
  }
  

  selectTicket(ticket: any) {
    this.selectedTicket = ticket;
    console.log('Ausgewähltes Ticket:', this.selectedTicket);
    console.log('Level des ausgewählten Tickets:', this.selectedTicket.level);
  }


  addComment() {
    if (this.newCommentContent.trim() === '') {
      return;
    }

    const commentData = { inhalt: this.newCommentContent };
    this.ticketService
      .addComment(this.selectedTicket.id, commentData)
      .subscribe(
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
    const newStatus =
      this.selectedTicket.status === 'offen' ? 'geschlossen' : 'offen';
    const options: Intl.DateTimeFormatOptions = {
      year: '2-digit',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    };
    const schlussdatum =
      newStatus === 'geschlossen'
        ? new Date().toLocaleString('en-US', options)
        : null;

    this.ticketService
      .updateTicket(this.selectedTicket.id, {
        status: newStatus,
        schlussdatum: schlussdatum,
      })
      .subscribe(
        () => {
          this.selectedTicket.status = newStatus;
          this.selectedTicket.schlussdatum = schlussdatum;
          this.loadTickets(); // Aktualisiere die Listen der offenen und geschlossenen Tickets
        },
        (error) => {
          console.error('Fehler beim Aktualisieren des Ticketstatus:', error);
        }
      );
  }

  getLevelDescription(prioritaet: string): string {
    switch (prioritaet) {
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
  
  

  getImageMimeType(filename: string): string {
    const extension = (filename.split('.').pop() || '').toLowerCase();
    switch (extension) {
      case 'jpg':
      case 'jpeg':
        return 'image/jpeg';
      case 'png':
        return 'image/png';
      case 'gif':
        return 'image/gif';
      default:
        return 'image/jpeg';
    }
  }
  
}
