import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
// 1. Importamos el motor de animaciones
import { provideAnimations } from '@angular/platform-browser/animations';
import { authInterceptor } from './auth-interceptor';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    
    // 2. Registramos el cliente HTTP e incrustamos nuestro interceptor para que vigile todo
    provideHttpClient(withInterceptors([authInterceptor])),
    // 2. Encendemos las animaciones aquí
    provideAnimations()
  ]
};