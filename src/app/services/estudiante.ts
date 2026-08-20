import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Estudiante } from '../models/estudiante';

@Injectable({
  providedIn: 'root',
})
export class EstudianteService {
  // Inyectamos el cliente HTTP (sintaxis moderna de Angular)
  private http = inject(HttpClient);

  // La ruta hacia tu bóveda de NestJS
  private apiUrl = 'http://localhost:3000/estudiantes';

  constructor() {}

  // 🛡️ Requiere permiso: 'ver:global'
  obtenerEstudiantes(): Observable<Estudiante[]> {
    // 👇 2. Extraemos la llave manualmente aquí mismo
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

    // 👇 3. Armamos la cabecera de seguridad
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    // 👇 4. Se la enviamos directamente a la bóveda
    return this.http.get<Estudiante[]>(this.apiUrl, { headers });
  }

  // 🛡️ Requiere permiso: 'matricular:estudiantes'
  matricularEstudiante(estudiante: Estudiante): Observable<Estudiante> {
    return this.http.post<Estudiante>(this.apiUrl, estudiante);
  }
}
