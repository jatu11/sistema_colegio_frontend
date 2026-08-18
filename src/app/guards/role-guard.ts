import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const roleGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  
  // 1. Recuperamos el token del almacenamiento local
  // (Asegúrate de que 'token' sea el nombre exacto que usas al guardarlo en el login)
  const token = localStorage.getItem('token'); 
  
  if (!token) {
    router.navigate(['/login']);
    return false;
  }

  try {
    // 2. Extraemos la información (payload) del JWT
    // El JWT tiene 3 partes separadas por puntos. La posición [1] es la data.
    const payloadBase64Url = token.split('.')[1];
    
    // Arreglamos caracteres especiales de la codificación web
    const payloadBase64 = payloadBase64Url.replace(/-/g, '+').replace(/_/g, '/');
    
    // Decodificamos de Base64 a un objeto JSON legible
    const jsonPayload = decodeURIComponent(window.atob(payloadBase64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    
    const usuarioInfo = JSON.parse(jsonPayload);
    const rolDelUsuario = usuarioInfo.rol; // Capturamos el rol

    // 3. Leemos la lista VIP de roles desde tu app.routes.ts
    const rolesPermitidos = route.data['roles'] as Array<string>;

    // 4. Verificamos el acceso
    if (rolesPermitidos && rolesPermitidos.includes(rolDelUsuario)) {
      return true; // ¡Acceso concedido!
    }

    // 5. Rechazo de acceso
    alert('Acceso Denegado: Su rol institucional no tiene permisos para esta área.');
    router.navigate(['/dashboard']);
    return false;

  } catch (error) {
    // Si alguien intentó falsificar el token y no se puede decodificar
    console.error('Error de seguridad con el token');
    localStorage.removeItem('token');
    router.navigate(['/login']);
    return false;
  }
};