import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './app/login/login.component';
import { RegistrateComponent } from './app/registrate/registrate.component';
import { AnmeldenComponent } from './app/anmelden/anmelden.component';
import { ManageTicketComponent } from './app/admin/manage-ticket/manage-ticket.component';
import { CreateTicketComponent } from './app/user/create-ticket/create-ticket.component';
import { AuthGuard } from './app/auth.guard';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'registrate', component: RegistrateComponent },
  { path: 'anmelden', component: AnmeldenComponent },
  {
    path: 'manage-ticket',
    component: ManageTicketComponent,
    canActivate: [AuthGuard],
    data: { expectedRole: 'admin' }
  },
  {
    path: 'create-ticket',
    component: CreateTicketComponent,
    canActivate: [AuthGuard],
    data: { expectedRole: 'user' }
  },
  { path: '', redirectTo: '/login', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
