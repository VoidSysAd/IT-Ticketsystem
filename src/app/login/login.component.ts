import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [CommonModule],
})
export class LoginComponent {
  constructor(private router: Router) {}

  navigateTo(route: string) {
    this.router.navigate([route]);
  }

  navigateToAnmelden(role: string) {
    console.log(`Navigating to anmelden with role: ${role}`);
    this.router.navigate(['/anmelden'], { queryParams: { role: role } });
  }
  
}
