import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateTicketComponent } from './app/user/create-ticket/create-ticket.component';
import { ManageTicketComponent } from './app/admin/manage-ticket/manage-ticket.component';
import { LoginComponent } from './app/login/login.component';

const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'create-ticket', component: CreateTicketComponent },
  { path: 'manage-ticket', component: ManageTicketComponent },
  // andere Routen...
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
