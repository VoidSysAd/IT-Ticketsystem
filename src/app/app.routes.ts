import { Router, Routes } from '@angular/router';
import { provideRouter } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegistrateComponent } from './registrate/registrate.component';
import { AnmeldenComponent } from './anmelden/anmelden.component';
import { ManageTicketComponent } from './admin/manage-ticket/manage-ticket.component';
import { CreateTicketComponent } from './user/create-ticket/create-ticket.component';
import { AuthGuard } from './auth.guard';

// app.routes.ts

export const routes: Routes = [
  { path: '', component: LoginComponent },
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
    data: { expectedRole: ['admin'] },
  },
  // ... weitere Routen ...

  { path: 'anmelden', component: AnmeldenComponent },
  {path: 'registrate', component: RegistrateComponent},
  {path: 'router', component: Router}
];

  