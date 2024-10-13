import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-create-ticket',
  templateUrl: './create-ticket.component.html',
  standalone: true,
  imports: [HttpClientModule, FormsModule] // Hier das HttpClientModule importieren
})
export class CreateTicketComponent {
  ticket = {
    id: '',
    name: '',
    description: '',
    level: '',
  };

  constructor(private http: HttpClient) {}

  createTicket() {
    const ticketData = { ...this.ticket };
    this.http.post('http://localhost:5000/api/tickets', ticketData).subscribe(response => {
      console.log('Ticket erstellt:', response);
    });
  }
}
