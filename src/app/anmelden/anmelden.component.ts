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
            // Save user information in AuthService
            this.authService.setUser(response);
  
            // Show success message
            this.message = 'Anmeldung erfolgreich! Sie werden weitergeleitet...';
            this.messageType = 'success';
  
            // Navigate based on role
            if (response.role === 'admin') {
              this.router.navigate(['/admin-dashboard']); // Navigate to admin dashboard
            } else if (response.role === 'user') {
              this.router.navigate(['/user-dashboard']); // Navigate to user dashboard
            } else {
              this.message = 'Unbekannte Benutzerrolle.';
              this.messageType = 'error';
            }
          } else {
            // Show error message if login fails
            this.message = response.message || 'Anmeldedaten sind ungültig.';
            this.messageType = 'error';
          }
        },
        (error) => {
          console.error('Fehler bei der Anmeldung:', error);
          this.message = error.error.message || 'Es gab einen Fehler bei der Anmeldung. Bitte versuchen Sie es erneut.';
          this.messageType = 'error';
        }
      );
    } else {
      this.message = 'Bitte füllen Sie alle Felder korrekt aus.';
      this.messageType = 'error';
    }
  }
  
  
}
