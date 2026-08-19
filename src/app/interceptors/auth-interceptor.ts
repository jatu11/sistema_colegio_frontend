import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // 1. Buscamos el token en el almacenamiento local
  const token = localStorage.getItem('token');

  // 2. Si existe el token, clonamos la petición original y le agregamos la cabecera
  if (token) {
    const peticionClonada = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
    // Enviamos la petición modificada al backend
    return next(peticionClonada);
  }

  // Si no hay token (ej. cuando recién está haciendo login), la dejamos pasar normal
  return next(req);
};
