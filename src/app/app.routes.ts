import { Routes } from '@angular/router';
import { provideRouter } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegistrateComponent } from './registrate/registrate.component';
import { AnmeldenComponent } from './anmelden/anmelden.component';
import { ManageTicketComponent } from './admin/manage-ticket/manage-ticket.component';
import { CreateTicketComponent } from './user/create-ticket/create-ticket.component';


export const routes: Routes = [
    { path: 'registrate', component: RegistrateComponent },
    { path: 'anmelden', component: AnmeldenComponent},
    {path: 'login', component: LoginComponent},

    {
      path: 'manage-ticket',
      component: ManageTicketComponent,
      // Weitere Einstellungen...
    },
    {
      path: 'create-ticket',
      component: CreateTicketComponent,
      // Weitere Einstellungen...
    },
    { path: '', redirectTo: 'login', pathMatch: 'full' },
  ];
  