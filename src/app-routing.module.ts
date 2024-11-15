// app-routing.module.ts

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './app/login/login.component';
import { RegistrateComponent } from './app/registrate/registrate.component';
import { AnmeldenComponent } from './app/anmelden/anmelden.component';
import { AdminDashboardComponent } from './app/admin-dashboard/admin-dashboard.component';
import { ManageTicketComponent } from './app/admin/manage-ticket/manage-ticket.component';
import { CreateTicketComponent } from './app/user/create-ticket/create-ticket.component';
import { AuthGuard } from './app/auth.guard';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'registrate', component: RegistrateComponent },
  { path: 'anmelden', component: AnmeldenComponent },
  {
    path: 'admin-dashboard',
    component: AdminDashboardComponent,
    canActivate: [AuthGuard],
    data: { expectedRole: 'admin' }
  },
  {
    path: 'create-ticket',
    component: CreateTicketComponent,
    canActivate: [AuthGuard],
    data: { expectedRole: ['user', 'admin'] }
  },
  {
    path: 'manage-ticket',
    component: ManageTicketComponent,
    canActivate: [AuthGuard],
    data: { expectedRole: 'admin' }
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
