import { Component } from '@angular/core';
import { NgForm, FormsModule } from '@angular/forms'; // FormsModule importieren
import { TicketService } from '../../services/ticket.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-create-ticket',
  templateUrl: './create-ticket.component.html',
  styleUrls: ['./create-ticket.component.css'],
  standalone: true, // Stellen Sie sicher, dass standalone auf true gesetzt ist
  imports: [CommonModule, FormsModule], // FormsModule hier hinzufügen
})
export class CreateTicketComponent {
  ticket = {
    titel: '',
    description: '',
    level: '',
  };
  ticketCreated: boolean = false;
  createdTicketId: string = '';
  selectedFile: File | null = null;

  constructor(
    private ticketService: TicketService,
    private router: Router
  ) {}

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0] as File;
  }

  createTicket(ticketForm: NgForm) {
    if (ticketForm.valid) {
      const ticketData = new FormData();
      ticketData.append('titel', this.ticket.titel);
      ticketData.append('beschreibung', this.ticket.description);
      ticketData.append('prioritaet', this.ticket.level);
      ticketData.append('erstellungsdatum', new Date().toISOString());
      ticketData.append('status', 'offen');


      if (this.selectedFile) {
        ticketData.append('image', this.selectedFile, this.selectedFile.name);
      }

      this.ticketService.createTicket(ticketData).subscribe(
        (response: any) => {
          // Erfolgsmeldung anzeigen
          this.ticketCreated = true;
          this.createdTicketId = response.ticket_id; // Angenommen, das Backend gibt die Ticket-ID zurück
          // Formular zurücksetzen
          ticketForm.resetForm();
        },
        (error) => {
          console.error('Fehler beim Erstellen des Tickets:', error);
          alert('Es gab einen Fehler beim Erstellen des Tickets.');
        }
      );
    } else {
      alert('Bitte füllen Sie alle Felder korrekt aus.');
    }
  }

  createNewTicket() {
    // Erfolgsnachricht ausblenden und Formular erneut anzeigen
    this.ticketCreated = false;
    this.createdTicketId = '';
    this.ticket = {
      titel: '',
      description: '',
      level: '',
    };
  }
}
