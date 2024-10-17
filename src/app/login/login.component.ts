// login.component.ts

import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router'; // Importieren Sie das RouterModule

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [CommonModule, RouterModule], // Fügen Sie RouterModule zu den Imports hinzu
})
export class LoginComponent {
  constructor(private router: Router) {}

  navigateTo(route: string) {
    this.router.navigate([route]);
  }

  navigateToAnmelden(role: string, targetRoute: string) {
    console.log(`Navigating to anmelden with role: ${role}, target: ${targetRoute}`);
    this.router.navigate(['/anmelden'], { queryParams: { role: role, target: targetRoute } });
  }
}
