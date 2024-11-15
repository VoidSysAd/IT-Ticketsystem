import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

interface Ticket {
  _id: string;
  titel: string;
  beschreibung: string;
  prioritaet: string;
  status: string;
  zugewiesenerBenutzer: string;
  erstellungsdatum: string;
  schlussdatum?: string;
  ersteller: string;
  bildBase64?: string;
  kommentare?: any[];
}

@Component({
  selector: 'app-show-status',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './show-status.component.html',
  styleUrls: ['./show-status.component.css']
})
export class ShowStatusComponentComponent implements OnInit {
  tickets: Ticket[] = [];
  errorMessage: string = '';
  selectedTicket: Ticket | null = null;
  currentUser: any = null;
  activeTab: 'offen' | 'meine' | 'geschlossen' = 'offen';
  offeneTickets: Ticket[] = [];
  meineTickets: Ticket[] = [];
  geschlosseneTickets: Ticket[] = [];

  constructor(
    private http: HttpClient, 
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getCurrentUser();
    this.loadUserTickets();
  }

  getCurrentUser(): void {
    this.currentUser = this.authService.getCurrentUser();
    console.log('Aktueller Benutzer:', this.currentUser);
  }

  loadUserTickets(): void {
    const userId = this.authService.getCurrentUser()?.name;
    console.log("Current userId (name) for fetching tickets:", userId);
  
    if (userId) {
      this.http.get<Ticket[]>(`http://localhost:5000/api/user-tickets?userId=${userId}`).subscribe({
        next: (data) => {
          this.tickets = data;
          this.filterTickets();
          console.log("Fetched tickets:", this.tickets);
        },
        error: (error) => {
          this.errorMessage = 'Fehler beim Laden der Tickets. Bitte versuchen Sie es erneut.';
          console.error('Error loading tickets:', error);
        }
      });
    } else {
      this.errorMessage = 'Benutzername ist erforderlich, um Tickets abzurufen.';
    }
  }

  filterTickets(): void {
    this.offeneTickets = this.tickets.filter(ticket => ticket.status === 'offen');
    this.geschlosseneTickets = this.tickets.filter(ticket => ticket.status === 'geschlossen');
    
    if (this.currentUser) {
      this.meineTickets = this.tickets.filter(ticket => 
        ticket.ersteller === this.currentUser.name || 
        ticket.zugewiesenerBenutzer === this.currentUser.name
      );
    }
  }

  selectTicket(ticket: Ticket): void {
    let base64Prefix = '';

    if (ticket.bildBase64) {
        if (!ticket.bildBase64.startsWith('data:image/')) {
            const imageType = ticket.bildBase64.charAt(0) === '/' ? 'jpeg' :
                              ticket.bildBase64.charAt(0) === 'i' ? 'png' :
                              ticket.bildBase64.charAt(0) === 'R' ? 'gif' :
                              'jpeg';

            base64Prefix = `data:image/${imageType};base64,`;
        }
    }

    this.selectedTicket = {
      ...ticket,
      bildBase64: ticket.bildBase64 ? `${base64Prefix}${ticket.bildBase64}` : undefined
    };

    console.log('Selected Ticket:', this.selectedTicket);
  }

  setActiveTab(tab: 'offen' | 'meine' | 'geschlossen'): void {
    this.activeTab = tab;
    this.selectedTicket = null;
  }

  getLevelDescription(prioritaet: string): string {
    const levels: { [key: string]: string } = {
      'niedrig': 'Niedrig',
      'normal': 'Normal',
      'hoch': 'Hoch',
      'dringend': 'Dringend'
    };
    return levels[prioritaet.toLowerCase()] || 'Normal';
  }

  navigateToCreateTicket(): void {
    this.router.navigate(['/create-ticket']);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
  get filteredTickets(): Ticket[] {
    return this.tickets.filter(ticket => 
      ticket.ersteller === this.currentUser?.name && 
      ticket.status === this.activeTab
    );
  }
}