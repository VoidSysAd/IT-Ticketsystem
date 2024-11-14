import { Component, OnInit } from '@angular/core';
import { TicketService } from '../../services/ticket.service';
import type { Ticket } from '../../interfaces/ticket.interface';
import { AuthService } from '../../auth.service';
import type { User } from '../../auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router'; // Importiere Router
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-manage-ticket',
  templateUrl: './manage-ticket.component.html',
  styleUrls: ['./manage-ticket.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule
  ]
})
export class ManageTicketComponent implements OnInit {
  public offeneTickets: Ticket[] = [];
  public geschlosseneTickets: Ticket[] = [];
  public meineTickets: Ticket[] = [];
  public selectedTicket: Ticket | null = null;
  public newCommentContent: string = '';
  public users: User[] = [];
  public selectedUser: string = '';
  public currentUser: User | null = null;
  public activeTab: 'offen' | 'geschlossen' | 'meine' = 'offen';

  constructor(
    private ticketService: TicketService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    console.log('Component initialized');
    this.loadUsers();
    this.getCurrentUser();
    this.loadTickets();
  }

  getCurrentUser(): void {
    this.currentUser = this.authService.getCurrentUser();
    console.log('Aktueller Benutzer:', this.currentUser);
  }

  loadUsers(): void {
    console.log('Loading users...');
    this.ticketService.getUsers().subscribe({
      next: (users) => {
        console.log('Received users:', users);
        this.users = users;
      },
      error: (error: Error) => {
        console.error('Fehler beim Laden der Benutzer:', error);
      }
    });
  }

  loadTickets(): void {
    console.log('Loading tickets...');
    this.ticketService.getTickets().subscribe({
      next: (tickets) => {
        console.log('Tickets empfangen:', tickets);

        this.offeneTickets = tickets
          .filter(ticket => ticket.status === 'offen')
          .sort((a, b) => new Date(b.erstellungsdatum).getTime() - 
                         new Date(a.erstellungsdatum).getTime());

        this.geschlosseneTickets = tickets
          .filter(ticket => ticket.status === 'geschlossen')
          .sort((a, b) => new Date(b.erstellungsdatum).getTime() - 
                         new Date(a.erstellungsdatum).getTime());

        if (this.currentUser) {
          this.meineTickets = tickets
            .filter(ticket => ticket.zugewiesenerBenutzer === this.currentUser?.name)
            .sort((a, b) => new Date(b.erstellungsdatum).getTime() - 
                           new Date(a.erstellungsdatum).getTime());
        }

        console.log('Offene Tickets:', this.offeneTickets);
        console.log('Geschlossene Tickets:', this.geschlosseneTickets);
        console.log('Meine Tickets:', this.meineTickets);
      },
      error: (error: Error) => {
        console.error('Fehler beim Laden der Tickets:', error);
      }
    });
  }

  selectTicket(ticket: Ticket): void {
    let base64Prefix = '';

    // Prüfen, ob ein Bild existiert und der Base64-String vorhanden ist
    if (ticket.bildBase64) {
        // Überprüfen, ob der Base64-String bereits einen Präfix enthält
        if (!ticket.bildBase64.startsWith('data:image/')) {
            // Erkennung des Bildtyps anhand der ersten paar Zeichen des Base64-Strings
            const imageType = ticket.bildBase64.charAt(0) === '/' ? 'jpeg' :
                              ticket.bildBase64.charAt(0) === 'i' ? 'png' :
                              ticket.bildBase64.charAt(0) === 'R' ? 'gif' :
                              'jpeg'; // Fallback für jpg/jpeg

            // Setze den korrekten Base64-Präfix basierend auf dem erkannten Bildtyp
            base64Prefix = `data:image/${imageType};base64,`;
        }
    }

    // Zuweisung des Bildes zum ausgewählten Ticket
    this.selectedTicket = {
      ...ticket,
      bildBase64: ticket.bildBase64 ? `${base64Prefix}${ticket.bildBase64}` : undefined
    };

    console.log('Selected Ticket:', this.selectedTicket);  // Debug-Ausgabe, um sicherzustellen, dass das Bild vorhanden ist
}


  
  
  

  addComment(): void {
    if (!this.selectedTicket || !this.newCommentContent.trim()) {
        return;
    }

    const currentUser = this.currentUser?.name || 'Unknown User';  // Fallback für den Fall, dass current_user undefined ist

    this.ticketService
      .addComment(this.selectedTicket._id, { inhalt: this.newCommentContent, current_user: currentUser })
      .subscribe({
        next: (response) => {
          if (this.selectedTicket && response.comment) {
            if (!this.selectedTicket.kommentare) {
              this.selectedTicket.kommentare = [];
            }
            this.selectedTicket.kommentare.push(response.comment);
            this.newCommentContent = '';
          }
        },
        error: (error: Error) => {
          console.error('Fehler beim Hinzufügen des Kommentars:', error);
        }
      });
}

  

  toggleTicketStatus(): void {
    if (!this.selectedTicket) {
      return;
    }
  
    const newStatus = this.selectedTicket.status === 'offen' ? 'geschlossen' : 'offen';
    const schlussdatum = newStatus === 'geschlossen' ? new Date().toISOString() : undefined;
  
    this.ticketService.updateTicket(this.selectedTicket._id, { status: newStatus, schlussdatum })
      .subscribe({
        next: () => {
          if (this.selectedTicket) {
            this.selectedTicket.status = newStatus;
            this.selectedTicket.schlussdatum = schlussdatum;
            this.loadTickets();
          }
        },
        error: (error: Error) => {
          console.error('Fehler beim Aktualisieren des Ticketstatus:', error);
        }
      });
  }

  assignTicket(ticketId: string, userId: string): void {
    this.ticketService.assignTicket(ticketId, userId).subscribe({
      next: (response) => {
        if (this.selectedTicket) {
          this.selectedTicket.zugewiesenerBenutzer = response.assigned_to;
          this.loadTickets();
        }
      },
      error: (error: Error) => {
        console.error('Fehler beim Zuweisen des Tickets:', error);
      }
    });
  }

  setActiveTab(tab: 'offen' | 'geschlossen' | 'meine'): void {
    this.activeTab = tab;
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

  getPriorityBadge(prioritaet: string): string {
    const badges: { [key: string]: string } = {
      'niedrig': 'badge-info',
      'normal': 'badge-primary',
      'hoch': 'badge-warning',
      'dringend': 'badge-danger'
    };
    return badges[prioritaet.toLowerCase()] || 'badge-primary';
  }

  getStatusBadge(status: string): string {
    return status === 'offen' ? 'badge-warning' : 'badge-success';
  }

  // Methode zum Navigieren zur Create-Ticket-Seite
  navigateToCreateTicket(): void {
    this.router.navigate(['/create-ticket']);
  }

  // Logout-Methode
  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}

