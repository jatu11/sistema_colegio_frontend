import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Tipamos los datos para que Angular nos ayude a no cometer errores
export interface UsuarioDTO {
  cedula: string;
  nombres: string;
  apellidos: string;
  rol: string;
  cargo?: string;
  area_academica?: string;
}

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/usuarios'; // Asegúrate de que apunte a tu backend

  registrarUsuario(usuario: UsuarioDTO): Observable<any> {
    return this.http.post<any>(this.apiUrl, usuario);
  }
  
  // Más adelante agregaremos aquí los métodos para obtener la lista, editar y suspender usuarios
}