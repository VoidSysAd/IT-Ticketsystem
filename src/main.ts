import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter, Routes } from '@angular/router';
import { AppComponent } from './app/app.component';
import { LoginComponent } from './app/login/login.component';
import { CreateTicketComponent } from './app/user/create-ticket/create-ticket.component';
import { ManageTicketComponent } from './app/admin/manage-ticket/manage-ticket.component';
import { provideHttpClient } from '@angular/common/http';
import { RegistrateComponent } from './app/registrate/registrate.component';
import { routes } from './app/app.routes';


const localRoutes: Routes = [
  { path: '', component: LoginComponent },  // Default route
  { path: 'create-ticket', component: CreateTicketComponent },
  { path: 'manage-ticket', component: ManageTicketComponent },
  { path: 'registrate', component: RegistrateComponent}
];


bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideHttpClient(), // provideHttpClient macht HttpClient in allen Standalone-Komponenten verfügbar
    
  ]
}).catch(err => console.error(err));
