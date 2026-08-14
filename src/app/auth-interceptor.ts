import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // 1. Buscamos el pase VIP en la memoria del navegador
  const token = localStorage.getItem('access_token');

  // 2. Si lo tenemos, hacemos una copia exacta de la petición y le agregamos la cabecera de seguridad
  if (token) {
    const peticionClonada = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    // Liberamos la petición modificada para que viaje al backend
    return next(peticionClonada);
  }

  // 3. Si no hay token (por ejemplo, cuando estamos en la pantalla de Login), la petición sigue su curso normal
  return next(req);
};