import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter, Routes } from '@angular/router';
import { AppComponent } from './app/app.component';
import { LoginComponent } from './app/login/login.component';
import { CreateTicketComponent } from './app/user/create-ticket/create-ticket.component';
import { ManageTicketComponent } from './app/admin/manage-ticket/manage-ticket.component';
import { provideHttpClient } from '@angular/common/http';

const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'create-ticket', component: CreateTicketComponent },
  { path: 'manage-ticket', component: ManageTicketComponent }
];

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideHttpClient() // provideHttpClient macht HttpClient in allen Standalone-Komponenten verfügbar
  ]
}).catch(err => console.error(err));
