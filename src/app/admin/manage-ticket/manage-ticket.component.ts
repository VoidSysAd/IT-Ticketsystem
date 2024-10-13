import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-manage-ticket',
  templateUrl: './manage-ticket.component.html',
  standalone: true,
  imports: [HttpClientModule, CommonModule]
})
export class ManageTicketComponent implements OnInit {
  tickets: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadTickets();
  }

  loadTickets() {
    this.http.get<any[]>('http://localhost:5000/api/tickets').subscribe(
      (data) => {
        this.tickets = data;
      },
      (error) => {
        console.error('Fehler beim Laden der Tickets:', error);
      }
    );
  }
}
