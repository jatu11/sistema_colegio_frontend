import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { EstudianteService } from '../services/estudiante';
import { Estudiante } from '../models/estudiante';

//Módulos de PrimeNG para la tabla y botones
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog'; //Para la ventana Modal
import { InputTextModule } from 'primeng/inputtext'; //Para las cajas de texto

@Component({
  selector: 'app-estudiantes',
  standalone: true,
  imports: [CommonModule, FormsModule, TableModule, ButtonModule, DialogModule, InputTextModule],
  templateUrl: './estudiantes.html',
  styleUrl: './estudiantes.css',
})
export class Estudiantes {
  private estudianteService = inject(EstudianteService);
  //2. Inyectamos el megáfono de Angular
  private cdr = inject(ChangeDetectorRef);
  // Controla la visibilidad de la ventana Modal
  mostrarModal: boolean = false;
  // Aquí se guardará la lista que llega del backend
  estudiantes: Estudiante[] = [];
  // Objeto temporal para el formulario (con el curso antepenúltimo por defecto)
  nuevoCadete: Estudiante = {
    cedula: '',
    matricula: '',
    nombres: '',
    apellidos: '',
    curso: '3ro de Bachillerato en Informática', // Valor por defecto
    tipoSangre: '',
  };

  ngOnInit(): void {
    this.cargarEstudiantes();
  }

  // Función para abrir la ventana
  abrirModalNuevoCadete() {
    this.mostrarModal = true;
  }

  // Función para guardar en la base de datos
  guardarCadete() {
    this.estudianteService.matricularEstudiante(this.nuevoCadete).subscribe({
      next: (respuesta) => {
        console.log('✅ Cadete matriculado con éxito:', respuesta);
        this.mostrarModal = false; // Cerramos la ventana
        this.cargarEstudiantes(); // Refrescamos la tabla para ver al nuevo cadete

        // Limpiamos el formulario para el siguiente
        this.nuevoCadete = {
          cedula: '',
          matricula: '',
          nombres: '',
          apellidos: '',
          curso: '3ro de Bachillerato en Informática',
          tipoSangre: '',
        };
      },
      error: (err) => {
        console.error('❌ Error al matricular:', err);
        // Aquí podrías agregar una alerta de error (ej. Cédula duplicada)
      },
    });
  }

  cargarEstudiantes() {
    this.estudianteService.obtenerEstudiantes().subscribe({
      next: (datos) => {
        console.log('📡 Datos de cadetes recibidos:', datos);
        this.estudiantes = [...datos];
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al cargar la lista de cadetes:', err);
      },
    });
  }
}
