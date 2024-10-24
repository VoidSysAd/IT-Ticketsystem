import { Component } from '@angular/core';
import { NgForm, FormsModule } from '@angular/forms';
import { TicketService } from '../../services/ticket.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import type { Ticket } from '../../interfaces/ticket.interface'; // Ticket importieren

@Component({
  selector: 'app-create-ticket',
  templateUrl: './create-ticket.component.html',
  styleUrls: ['./create-ticket.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class CreateTicketComponent {
  ticket: Partial<Ticket> = {
    titel: '',
    beschreibung: '', // Verwende 'beschreibung', um dem Interface zu entsprechen
    prioritaet: '', // Verwende 'prioritaet' anstelle von 'level'
    erstellungsdatum: new Date().toISOString(),
    status: 'offen',  // Hier stellen wir sicher, dass der Status entweder "offen" oder "geschlossen" ist
  };
  ticketCreated: boolean = false;
  createdTicketId: string = '';
  selectedFile: File | null = null;

  constructor(
    private ticketService: TicketService,
    private router: Router
  ) {}

  onFileSelected(event: Event): void {
    const element = event.target as HTMLInputElement;
    const files = element.files;
    if (files && files.length > 0) {
      this.selectedFile = files[0];
    }
  }

  createTicket(ticketForm: NgForm): void {
    if (ticketForm.valid) {
      const ticketData: Partial<Ticket> = {
        titel: this.ticket.titel,
        beschreibung: this.ticket.beschreibung, // Verwende 'beschreibung'
        prioritaet: this.ticket.prioritaet, // Verwende 'prioritaet'
        erstellungsdatum: new Date().toISOString(),
        status: 'offen',  // Der Status wird als "offen" definiert
      };

      this.ticketService.createTicket(ticketData).subscribe({
        next: (response: { ticket_id: string }) => {
          this.ticketCreated = true;
          this.createdTicketId = response.ticket_id;
          ticketForm.resetForm();
        },
        error: (error: Error) => {
          console.error('Fehler beim Erstellen des Tickets:', error);
          alert('Es gab einen Fehler beim Erstellen des Tickets.');
        }
      });
    } else {
      alert('Bitte füllen Sie alle Felder korrekt aus.');
    }
  }

  createNewTicket(): void {
    this.ticketCreated = false;
    this.createdTicketId = '';
    this.ticket = {
      titel: '',
      beschreibung: '',
      prioritaet: '',
      erstellungsdatum: new Date().toISOString(),
      status: 'offen',  // Standardmäßig auf "offen" gesetzt
    };
  }
}
