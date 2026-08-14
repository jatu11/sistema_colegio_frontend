import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CursoService, Curso } from '../services/curso';

// Módulos de PrimeNG
import { TableModule } from 'primeng/table';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { DropdownModule } from 'primeng/dropdown';

import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-cursos',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    TableModule,
    CardModule,
    ButtonModule,
    DialogModule,
    InputTextModule,
    InputNumberModule,
    DropdownModule,
    ToastModule,
  ],
  providers: [MessageService],
  templateUrl: './cursos.html',
  styleUrl: './cursos.css',
})
export class Cursos implements OnInit {
  private cursoService = inject(CursoService);
  private messageService = inject(MessageService); //mensajero
  cursos: Curso[] = [];
  guardando: boolean = false; // 👈 Nuevo interruptor para el botón de carga
  modoEdicion: boolean = false; // 👈 Nuevo interruptor

  // Variables para controlar el Modal
  mostrarModal: boolean = false;
  // 👇 Las listas para los selectores
  niveles = [
    '8vo Año Básica',
    '9no Año Básica',
    '10mo Año Básica',
    '1ro Bachillerato',
    '2do Bachillerato',
    '3ro Bachillerato',
  ];
  especialidades = ['Informática', 'Contabilidad', 'Ciencias', 'EBS'];
  nuevoCurso: Curso = this.cursoVacio();

  ngOnInit() {
    this.cargarCursos();
  }

  cargarCursos() {
    this.cursoService.obtenerCursos().subscribe({
      next: (data) => (this.cursos = data),
      error: (err) => console.error(err),
    });
  }

  // Inicializa el formulario con valores por defecto para agilizar tu trabajo
  cursoVacio(): Curso {
    return {
      nombre: '',
      nivel: '3ro de Bachillerato',
      especialidad: 'Informática',
      horas_semanales: 2,
    };
  }

  abrirModal() {
    this.nuevoCurso = this.cursoVacio();
    this.modoEdicion = false;
    this.mostrarModal = true;
  }

  abrirModalEditar(curso: Curso) {
    // Hacemos una copia exacta del curso para no editar la tabla en tiempo real hasta guardar
    this.nuevoCurso = { ...curso };
    this.modoEdicion = true; // Estamos en modo edición
    this.mostrarModal = true;
  }

  // 4. Modificamos guardarCurso para que decida si hace POST o PUT
  guardarCurso() {
    this.nuevoCurso.nombre = this.nuevoCurso.nombre.toUpperCase();
    this.guardando = true;

    // Si estamos en modo edición y tenemos un ID...
    if (this.modoEdicion && this.nuevoCurso.id) {
      this.cursoService.actualizarCurso(this.nuevoCurso.id, this.nuevoCurso).subscribe({
        next: () => {
          this.finalizarGuardado('¡Actualizado!', 'Asignatura editada correctamente.');
        },
        error: () => this.manejarErrorGuardado(),
      });
    } else {
      // Si estamos creando uno nuevo...
      this.cursoService.crearCurso(this.nuevoCurso).subscribe({
        next: () => {
          this.finalizarGuardado('¡Éxito!', 'Asignatura guardada correctamente en la malla.');
        },
        error: () => this.manejarErrorGuardado(),
      });
    }
  }

  // 3. Nueva función para el botón rojo de basura
  eliminar(curso: Curso) {
    // Pedimos confirmación nativa del navegador para evitar accidentes
    if (confirm(`¿Estás seguro de que deseas eliminar la asignatura: ${curso.nombre}?`)) {
      this.cursoService.eliminarCurso(curso.id!).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Eliminado',
            detail: 'Asignatura borrada de la malla.',
          });
          this.cargarCursos(); // Recargamos la tabla
        },
        error: (err) =>
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudo eliminar.',
          }),
      });
    }
  }

  // Funciones auxiliares para no repetir código
  finalizarGuardado(titulo: string, detalle: string) {
    this.guardando = false;
    this.mostrarModal = false;
    this.cargarCursos();
    this.messageService.add({ severity: 'success', summary: titulo, detail: detalle });
  }

  manejarErrorGuardado() {
    this.guardando = false;
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Esta asignatura ya está registrada o hubo un error.',
    });
  }
}
