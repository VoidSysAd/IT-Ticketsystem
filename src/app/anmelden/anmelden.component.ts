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
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const credentials = this.loginForm.value;

      this.authService.login(credentials.name, credentials.email).subscribe(
        (response: any) => {
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

              // Navigiere zur entsprechenden Seite nach kurzer Verzögerung
              setTimeout(() => {
                if (response.role === 'admin') {
                  this.router.navigate(['manage-ticket']);
                } else {
                  this.router.navigate(['create-ticket']);
                }
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
