import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Definimos la estructura de la materia
export interface Curso {
  id?: number;
  nombre: string;
  nivel: string;
  area: string;
  tipo_modulo: string;
  familia_profesional?: string | null;
  figura_profesional?: string | null;
  horas_semanales: number;
}

@Injectable({
  providedIn: 'root',
})
export class CursoService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/cursos'; // Ruta de NestJS que crearemos luego

  obtenerCursos(): Observable<Curso[]> {
    return this.http.get<Curso[]>(this.apiUrl);
  }

  // 👇 Nuevo método para enviar los datos al backend
  crearCurso(curso: Curso): Observable<Curso> {
    return this.http.post<Curso>(this.apiUrl, curso);
  }

  actualizarCurso(id: number, curso: Curso): Observable<Curso> {
    return this.http.put<Curso>(`${this.apiUrl}/${id}`, curso);
  }

  eliminarCurso(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  // 👇 El detonador de la magia
  autoGenerarMalla(): Observable<any> {
    return this.http.post(`${this.apiUrl}/autogenerar-soporte`, {});
  }
}
