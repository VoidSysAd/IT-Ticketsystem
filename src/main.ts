import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes'; // Route von externer Datei laden
import { provideHttpClient } from '@angular/common/http';
import { AuthGuard } from './app/auth.guard';
import { AuthService } from './app/auth.service';
import { appConfig } from './app/app.config';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes), // Nutze die externe Routen-Definition
    provideHttpClient(),
    AuthGuard,      // AuthGuard bereitstellen
    AuthService,    // AuthService bereitstellen
  ],
}).catch((err) => console.error(err));
