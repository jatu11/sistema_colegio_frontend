import { Routes } from '@angular/router';
import { Login } from './login/login';
import { Dashboard } from './dashboard/dashboard';

export const routes: Routes = [
  // 1. Cuando la ruta sea '/login', muestra la pantalla de acceso
  { path: 'login', component: Login },

  // 4. Cuando la ruta sea '/login', muestra la pantalla de acceso
  { path: 'Dashboard', component: Dashboard },

  // 2. Si entran a la raíz (la URL vacía), redirige automáticamente al login
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  // 3. Si escriben cualquier otra ruta que no exista, mándalos al login por seguridad
  { path: '**', redirectTo: 'login' },

];
