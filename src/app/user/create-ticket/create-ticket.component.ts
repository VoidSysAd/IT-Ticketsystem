import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-create-ticket',
  templateUrl: './create-ticket.component.html',
  standalone: true,
  imports: [FormsModule, CommonModule] // HttpClientModule wird hier nicht mehr benötigt
})
export class CreateTicketComponent {
  ticket = {
    titel: '',
    description: '',
    level: '',
  };

  constructor(private http: HttpClient) {} // HttpClient ist bereits verfügbar durch provideHttpClient()

  createTicket() {
    const ticketData = { ...this.ticket };
    this.http.post('http://localhost:5000/api/tickets', ticketData).subscribe(
      response => {
        console.log('Ticket erstellt:', response);
      },
      error => {
        console.error('Fehler beim Erstellen des Tickets:', error);
      }
    );
  }
}
