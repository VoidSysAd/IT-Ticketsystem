import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegistrateComponent } from './registrate/registrate.component';
import { AnmeldenComponent } from './anmelden/anmelden.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { CreateTicketComponent } from './user/create-ticket/create-ticket.component';
import { ManageTicketComponent } from './admin/manage-ticket/manage-ticket.component';
import { AuthGuard } from './auth.guard';
import { UserDashboardComponent } from './user-dashboard/user-dashboard.component';
import { ShowStatusComponentComponent } from './show-status/show-status.component';

export const routes: Routes = [
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

  {
    path: 'user-dashboard',
    component: UserDashboardComponent,
    canActivate: [AuthGuard],
    data: { expectedRole: 'user' },
  },
  {
    path: 'show-status',
    component: ShowStatusComponentComponent,  // Add this route for show-status
    canActivate: [AuthGuard],
    data: { expectedRole: 'user' },
  }
];
