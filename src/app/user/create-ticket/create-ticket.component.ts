import { Component } from '@angular/core'; 
import { NgForm, FormsModule } from '@angular/forms';
import { TicketService } from '../../services/ticket.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import type { Ticket } from '../../interfaces/ticket.interface'; 
import { AuthService } from '../../auth.service';

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
    beschreibung: '',
    prioritaet: '',
    erstellungsdatum: new Date().toISOString(),
    status: 'offen',
    bildBase64: '',
    ersteller: '' // Neu hinzugefügt 
  };
  ticketCreated: boolean = false;
  createdTicketId: string = '';
  selectedFile: File | null = null;

  constructor(
    private ticketService: TicketService,
    private router: Router,
    private authService: AuthService // Inject AuthService
  ) {    // Setze den aktuellen Benutzer als Ersteller
    const currentUser = this.authService.getCurrentUser();
    if (currentUser && currentUser.name) {
      this.ticket.ersteller = currentUser.name;
    }}

  onFileSelected(event: Event): void {
    const element = event.target as HTMLInputElement;
    const files = element.files;
    if (files && files.length > 0) {
      const file = files[0];
      
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          this.ticket.bildBase64 = reader.result;
        }
      };
      reader.readAsDataURL(file);
    }
  }

  createTicket(ticketForm: NgForm): void {
    if (ticketForm.valid) {
      const ticketData: Partial<Ticket> = {
        titel: this.ticket.titel,
        beschreibung: this.ticket.beschreibung,
        prioritaet: this.ticket.prioritaet,
        erstellungsdatum: new Date().toISOString(),
        status: 'offen',
        bildBase64: this.ticket.bildBase64, // Hier wird das Base64-Bild gesendet
        ersteller: this.ticket.ersteller // Neu hinzugefügt
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
    const currentUser = this.authService.getCurrentUser();
    this.ticketCreated = false;
    this.createdTicketId = '';
    this.ticket = {
      titel: '',
      beschreibung: '',
      prioritaet: '',
      erstellungsdatum: new Date().toISOString(),
      status: 'offen',
      ersteller: currentUser?.name || '' // Behalte den Ersteller beim Zurücksetzen
    };
  }
}
