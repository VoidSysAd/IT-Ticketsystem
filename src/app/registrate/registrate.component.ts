// registrate.component.ts

import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  FormsModule,
} from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AccountService } from './account.service'; // Der Service, der für die Registrierung verantwortlich ist
import { User } from './user.interface'; // Importiere das User-Interface

@Component({
  selector: 'app-registrate',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './registrate.component.html',
  styleUrls: ['./registrate.component.css'],
})
export class RegistrateComponent {
  registrationForm: FormGroup;
  departments: string[] = [
    'IT',
    'Vertrieb',
    'Marketing',
    'Personalwesen',
    'Finanzen',
    'Produktion',
    'Einkauf',
  ];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private accountService: AccountService
  ) {
    // Initialisiere das Formular
    this.registrationForm = this.fb.group({
      name: ['', Validators.required],
      abteilung: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
    });
  }

  // Methode, die beim Absenden des Formulars aufgerufen wird
  onSubmit() {
    if (this.registrationForm.valid) {
      const formData = this.registrationForm.value;

      // Überprüfen und Protokollieren der Abteilung und Rolle
      console.log('Formulardaten:', formData);

      // Bestimme die Rolle basierend auf der Abteilung
      let role = 'user';
      if (formData.abteilung === 'IT') {
        role = 'admin';
      }

      console.log('Zugewiesene Rolle:', role);

      const accountData: Partial<User> = {
        name: formData.name,
        abteilung: formData.abteilung,
        email: formData.email,
        role: role,
      };

      // Sende die Daten an den Backend-Service
      this.accountService.register(accountData).subscribe(
        (response: User) => {
          alert('Account erfolgreich registriert!');
          this.registrationForm.reset();
          this.router.navigate(['login']); // Optional: Zurück zur Login-Seite navigieren
        },
        (error: any) => {
          console.error('Fehler beim Registrieren des Accounts:', error);
          let errorMessage =
            'Es gab einen Fehler bei der Registrierung. Bitte versuchen Sie es erneut.';
          if (error.error && error.error.error) {
            errorMessage += '\n' + error.error.error;
          }
          alert(errorMessage);
        }
      );
    } else {
      alert('Bitte füllen Sie alle Felder korrekt aus.');
    }
  }
}
