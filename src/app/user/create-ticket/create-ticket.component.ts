import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-create-ticket',
  templateUrl: './create-ticket.component.html',
  standalone: true,
  imports: [HttpClientModule, FormsModule, CommonModule]
})
export class CreateTicketComponent {
  ticket = {
    titel: '',
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
