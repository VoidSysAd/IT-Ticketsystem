import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CreateTicketComponent } from './user/create-ticket/create-ticket.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CreateTicketComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'my-it-hotline';
}
