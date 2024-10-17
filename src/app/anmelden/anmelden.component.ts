import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  FormsModule,
} from '@angular/forms';
import { AuthService } from '../auth.service';// Überprüfen Sie diesen Import
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

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private authService: AuthService, // Stellen Sie sicher, dass dies korrekt ist
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
          // Ihre Logik hier
        },
        (error) => {
          // Fehlerbehandlung
        }
      );
    } else {
      alert('Bitte füllen Sie alle Felder korrekt aus.');
    }
  }
}
