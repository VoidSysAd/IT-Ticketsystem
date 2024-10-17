import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AccountService } from './account.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-registrate',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './registrate.component.html',
  styleUrls: ['./registrate.component.css']
})
export class RegistrateComponent {
  registrationForm: FormGroup;
  departments: string[] = ['IT', 'Vertrieb', 'Marketing', 'Personalwesen', 'Finanzen', 'Produktion', 'Einkauf'];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private accountService: AccountService
  ) {
    this.registrationForm = this.fb.group({
      name: ['', Validators.required],
      abteilung: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit() {
    if (this.registrationForm.valid) {
      const formData = this.registrationForm.value;

      // Bestimme die Rolle basierend auf der Abteilung
      let role = 'user';
      if (formData.abteilung === 'IT') {
        role = 'admin';
      }

      const accountData = {
        name: formData.name,
        abteilung: formData.abteilung,
        email: formData.email,
        role: role
      };

      // Sende die Daten an den Backend-Service
      this.accountService.registerAccount(accountData).subscribe(
        response => {
          alert('Account erfolgreich registriert!');
          this.registrationForm.reset();
          this.router.navigate(['login']); // Optional: Zurück zur Login-Seite navigieren
        },
        error => {
          console.error('Fehler beim Registrieren des Accounts:', error);
          alert('Es gab einen Fehler bei der Registrierung. Bitte versuchen Sie es erneut.');
        }
      );
    } else {
      alert('Bitte füllen Sie alle Felder korrekt aus.');
    }
  }
}
