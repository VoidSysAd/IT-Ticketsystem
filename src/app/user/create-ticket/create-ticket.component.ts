import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-create-ticket',
  templateUrl: './create-ticket.component.html',
  styleUrls: ['./create-ticket.component.css'],
  standalone: true,
  imports: [FormsModule, CommonModule]
})
export class CreateTicketComponent {
  ticket = {
    titel: '',
    description: '',
    level: '',
  };
  ticketCreated: boolean = false;
  createdTicketId: string = '';

  constructor(private http: HttpClient) {}

  createTicket() {
    const ticketData = { ...this.ticket };
    this.http.post<{ ticket_id: string }>('http://localhost:5000/api/tickets', ticketData).subscribe(response => {
      console.log('Ticket erstellt:', response);
      this.ticketCreated = true;
      this.createdTicketId = response.ticket_id;
    }, error => {
      console.error('Fehler beim Erstellen des Tickets:', error);
    });
  }

  createNewTicket() {
    this.ticket = {
      titel: '',
      description: '',
      level: '',
    };
    this.ticketCreated = false;
    this.createdTicketId = '';
  }
}
