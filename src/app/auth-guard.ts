import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  
  // Revisamos si existe el token en la memoria del navegador
  const token = localStorage.getItem('access_token');

  if (token) {
    // Si hay token, el guardia abre la puerta
    return true; 
  } else {
    // Si no hay token, lo redirige a la fuerza al login
    router.navigate(['/login']);
    return false;
  }
};