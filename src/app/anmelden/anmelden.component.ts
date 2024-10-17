// anmelden.component.ts

import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  FormsModule,
} from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-anmelden',
  standalone: true,
  templateUrl: './anmelden.component.html',
  styleUrls: ['./anmelden.component.css'],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
})
export class AnmeldenComponent implements OnInit {
  loginForm: FormGroup;
  role: string = '';
  targetRoute: string = ''; // <--- Fügen Sie diese Zeile hinzu
  message: string = ''; 
  messageType: 'success' | 'error' | '' = '';

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
    });
  }

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.role = params['role'] || 'user';
      this.targetRoute = params['target'] || 'create-ticket'; // <--- Stellen Sie sicher, dass targetRoute hier gesetzt wird
      console.log('Anmelden - Erwartete Rolle:', this.role);
      console.log('Anmelden - Zielroute:', this.targetRoute);
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const credentials = this.loginForm.value;

      this.authService.login(credentials.name, credentials.email).subscribe(
        (response: any) => {
          console.log('Login - Serverantwort:', response);
          if (response.success) {
            // Überprüfe, ob der Benutzer die richtige Rolle hat
            if (this.role === 'admin' && response.role !== 'admin') {
              this.message =
                'Zugriff verweigert: Sie haben keine Admin-Berechtigungen.';
            } else {
              // Speichere die Benutzerinformationen im AuthService
              this.authService.setUser(response);

              // Erfolgsmeldung anzeigen
              this.message =
                'Anmeldung erfolgreich! Sie werden weitergeleitet...';

              // Navigiere zur Zielroute nach kurzer Verzögerung
              setTimeout(() => {
                this.router.navigate([this.targetRoute]);
              }, 2000); // 2 Sekunden Verzögerung
            }
          } else {
            // Fehlermeldung anzeigen
            this.message =
              response.message || 'Anmeldedaten sind ungültig.';
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
