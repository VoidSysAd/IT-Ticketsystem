import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  FormsModule,
} from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-anmelden',
  standalone: true,
  templateUrl: './anmelden.component.html',
  styleUrls: ['./anmelden.component.css'],
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
})
export class AnmeldenComponent {
  loginForm: FormGroup;
  message: string = '';
  messageType: 'success' | 'error' | '' = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const credentials = this.loginForm.value;

      this.authService.login(credentials.name, credentials.email).subscribe(
        (response: any) => {
          console.log('Login - Serverantwort:', response);
          if (response.success) {
            // Speichere die Benutzerinformationen im AuthService
            this.authService.setUser(response);

            // Erfolgsmeldung anzeigen
            this.message =
              'Anmeldung erfolgreich! Sie werden weitergeleitet...';

            // Navigiere basierend auf der Rolle
            if (response.role === 'admin') {
              // Admin wird zur Admin-Dashboard-Komponente weitergeleitet
              setTimeout(() => {
                this.router.navigate(['/admin-dashboard']);
              }, 1000); // 2 Sekunden Verzögerung
            } else {
              // Benutzer wird zur Create-Ticket-Seite weitergeleitet
              setTimeout(() => {
                this.router.navigate(['/create-ticket']);
              }, 1000); // 2 Sekunden Verzögerung
            }
          } else {
            // Fehlermeldung anzeigen
            this.message = response.message || 'Anmeldedaten sind ungültig.';
          }
        },
        (error) => {
          console.error('Fehler bei der Anmeldung:', error);
          this.message =
            error.error.message ||
            'Es gab einen Fehler bei der Anmeldung. Bitte versuchen Sie es erneut.';
        }
      );
    } else {
      this.message = 'Bitte füllen Sie alle Felder korrekt aus.';
    }
  }
}
