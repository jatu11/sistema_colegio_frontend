import { Routes } from '@angular/router';
import { Login } from './login/login';
import { Dashboard } from './dashboard/dashboard';
import { authGuard } from './auth-guard';
import { Curso } from './services/curso';
import { Cursos } from './cursos/cursos';
import { Usuarios } from './usuarios/usuarios';
import { roleGuard } from './guards/role-guard';

export const routes: Routes = [
  // 1. Cuando la ruta sea '/login', muestra la pantalla de acceso
  { path: 'login', component: Login },
  {
    path: 'dashboard',
    component: Dashboard,
    canActivate: [authGuard], // 👈 2. Le asignamos la vigilancia de esta ruta
  },
  {
    path: 'cursos',
    component: Cursos,
    canActivate: [roleGuard],
    data: { roles: ['ADMIN', 'ADMINISTRACION'] },
  },
  {
    path: 'usuarios',
    component: Usuarios,
    canActivate: [roleGuard], // 👈 El guardia vigila aquí
    // Quizás la gestión de usuarios sea solo para ti (Sistemas) y Recursos Humanos
    data: { roles: ['ADMIN'] },
  },
  // 2. Si entran a la raíz (la URL vacía), redirige automáticamente al login
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  // 3. Si escriben cualquier otra ruta que no exista, mándalos al login por seguridad
  { path: '**', redirectTo: 'login' },
];
