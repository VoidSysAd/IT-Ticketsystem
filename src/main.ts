import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter, Routes } from '@angular/router';
import { AppComponent } from './app/app.component';
import { LoginComponent } from './app/login/login.component';
import { RegistrateComponent } from './app/registrate/registrate.component';
import { AnmeldenComponent } from './app/anmelden/anmelden.component';
import { AdminDashboardComponent } from './app/admin-dashboard/admin-dashboard.component';
import { CreateTicketComponent } from './app/user/create-ticket/create-ticket.component';
import { ManageTicketComponent } from './app/admin/manage-ticket/manage-ticket.component';
import { provideHttpClient } from '@angular/common/http';
import { AuthGuard } from './app/auth.guard';
import { AuthService } from './app/auth.service';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },  // Default route
  { path: 'login', component: LoginComponent },
  { path: 'registrate', component: RegistrateComponent },
  { path: 'anmelden', component: AnmeldenComponent },
  {
    path: 'admin-dashboard',
    component: AdminDashboardComponent,
    canActivate: [AuthGuard],
    data: { expectedRole: 'admin' },
  },
  {
    path: 'create-ticket',
    component: CreateTicketComponent,
    canActivate: [AuthGuard],
    data: { expectedRole: ['user', 'admin'] },
  },
  {
    path: 'manage-ticket',
    component: ManageTicketComponent,
    canActivate: [AuthGuard],
    data: { expectedRole: 'admin' },
  },
  // Weitere Routen hinzufügen, falls erforderlich
];

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    AuthGuard,      // AuthGuard bereitstellen
    AuthService,    // AuthService bereitstellen
  ],
}).catch((err) => console.error(err));
