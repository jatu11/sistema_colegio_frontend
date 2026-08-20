import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // Ponemos este emoji afuera del if para saber que el interceptor despertó
  console.log(`🚀 [Interceptor] Despierto e interceptando: ${req.url}`);

  // 👇 LA REGLA MÁGICA: "¿Estamos en el navegador?"
  if (typeof window !== 'undefined' && window.localStorage) {
    
    // Cambia 'token' por la llave que uses en tu login si es diferente
    const token = localStorage.getItem('token'); 
    console.log(`🔑 [Interceptor] ¿Hay token en el navegador?:`, token ? 'SÍ' : 'NO');

    if (token) {
      const peticionClonada = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
      return next(peticionClonada);
    }
  }

  // Si no hay token o estamos en el servidor, dejamos pasar la petición normal
  return next(req);
};