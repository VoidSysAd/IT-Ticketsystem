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
  // Initialisierung des Ticket-Objekts mit Typ Partial<Ticket>
  ticket: Partial<Ticket> = {
    titel: '',
    beschreibung: '',
    prioritaet: '',
    erstellungsdatum: new Date().toISOString(),
    status: 'offen',
    bildBase64: '',
    ersteller: '' // Neu hinzugefügt 
  };

  // Flags und Variablen für den Status der Ticketerstellung
  ticketCreated: boolean = false;
  createdTicketId: string = '';
  selectedFileName: string = ''; // Neu hinzugefügt für die Anzeige des Dateinamens

  constructor(
    private ticketService: TicketService,
    private router: Router,
    private authService: AuthService // Inject AuthService
  ) {    
    // Setze den aktuellen Benutzer als Ersteller
    const currentUser = this.authService.getCurrentUser();
    if (currentUser && currentUser.name) {
      this.ticket.ersteller = currentUser.name;
    }
  }

  /**
   * Methode zum Auswählen einer Datei.
   * Liest die ausgewählte Datei als Base64-String und setzt den Dateinamen.
   * @param event - Das Event vom Dateiupload-Input
   */
  onFileSelected(event: Event): void {
    const element = event.target as HTMLInputElement;
    const files = element.files;
    if (files && files.length > 0) {
      const file = files[0];
      this.selectedFileName = file.name; // Setze den Dateinamen zur Anzeige

      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          this.ticket.bildBase64 = reader.result;
        }
      };
      reader.readAsDataURL(file);
    } else {
      // Wenn keine Datei ausgewählt wurde, setze die Variablen zurück
      this.selectedFileName = '';
      this.ticket.bildBase64 = '';
    }
  }

  /**
   * Methode zum Triggern des versteckten Datei-Inputs.
   * Wird aufgerufen, wenn der benutzerdefinierte Button geklickt wird.
   * @param inputId - Die ID des versteckten Datei-Inputs
   */
  triggerFileInput(inputId: string): void {
    const fileInput = document.getElementById(inputId) as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
  }

  /**
   * Methode zum Erstellen eines Tickets.
   * Sendet die Ticket-Daten an den Server über den TicketService.
   * @param ticketForm - Das NgForm-Objekt des Formulars
   */
  createTicket(ticketForm: NgForm): void {
    if (ticketForm.valid) {
      const ticketData: Partial<Ticket> = {
        titel: this.ticket.titel,
        beschreibung: this.ticket.beschreibung,
        prioritaet: this.ticket.prioritaet,
        erstellungsdatum: new Date().toISOString(),
        status: 'offen',
        bildBase64: this.ticket.bildBase64, // Base64-Bild
        ersteller: this.ticket.ersteller // Ersteller
      };

      this.ticketService.createTicket(ticketData).subscribe({
        next: (response: { ticket_id: string }) => {
          this.ticketCreated = true;
          this.createdTicketId = response.ticket_id;
          ticketForm.resetForm();
          this.resetTicket(); // Zusätzliche Methode zum Zurücksetzen des Ticket-Objekts
        },
        error: (error: any) => {
          console.error('Fehler beim Erstellen des Tickets:', error);
          alert('Es gab einen Fehler beim Erstellen des Tickets.');
        }
      });
    } else {
      alert('Bitte füllen Sie alle Felder korrekt aus.');
    }
  }

  /**
   * Methode zum Erstellen eines neuen Tickets.
   * Setzt die relevanten Variablen zurück und behält den Ersteller bei.
   */
  createNewTicket(): void {
    const currentUser = this.authService.getCurrentUser();
    this.ticketCreated = false;
    this.createdTicketId = '';
    this.resetTicket();
  }

  /**
   * Methode zum Zurücksetzen des Ticket-Objekts.
   * Behält den Ersteller bei.
   */
  private resetTicket(): void {
    this.ticket = {
      titel: '',
      beschreibung: '',
      prioritaet: '',
      erstellungsdatum: new Date().toISOString(),
      status: 'offen',
      bildBase64: '',
      ersteller: this.ticket.ersteller // Behalte den Ersteller beim Zurücksetzen
    };
    this.selectedFileName = '';
  }
}
