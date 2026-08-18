import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CursoService, Curso } from '../services/curso';

import { TableModule } from 'primeng/table';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { DropdownModule } from 'primeng/dropdown';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ChartModule } from 'primeng/chart';

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
    ChartModule,
  ],
  providers: [MessageService],
  templateUrl: './cursos.html',
  styleUrl: './cursos.css',
})
export class Cursos implements OnInit {
  private cursoService = inject(CursoService);
  private messageService = inject(MessageService);

  cursos: Curso[] = [];
  cursosMostrados: Curso[] = [];

  filtroNivel: string = '';
  filtroFigura: string = '';

  mostrarModal: boolean = false;
  guardando: boolean = false;
  modoEdicion: boolean = false;

  niveles = [
    '8vo Año Básica',
    '9no Año Básica',
    '10mo Año Básica',
    '1ro Bachillerato',
    '2do Bachillerato',
    '3ro Bachillerato',
  ];
  areas = [
    'Informática',
    'Matemática',
    'Lengua y Literatura',
    'Ciencias Naturales',
    'Ciencias Sociales',
    'Lengua Extranjera',
    'Contabilidad',
  ];
  tiposModulo = ['Tronco Común', 'Módulo General', 'Especialización', 'Práctico Experimental'];

  // 👇 Se agregaron las nuevas familias y figuras
  familias = ['Tecnologías', 'Administrativa y Financiera'];
  figuras = ['Soporte Informático', 'Gestión financiera y contable'];

  nuevoCurso: Curso = this.cursoVacio();

  datosGrafico: any;
  opcionesGrafico: any;

  ngOnInit() {
    this.cargarCursos();
    this.configurarOpcionesGrafico();
  }

  cargarCursos() {
    this.cursoService.obtenerCursos().subscribe({
      next: (data) => {
        this.cursos = data;
        this.aplicarFiltros();
      },
      error: (err) => console.error(err),
    });
  }

  // 👇 NUEVO CANDADO LÓGICO: Decide si se muestra o no la tabla
  get mostrarResultados(): boolean {
    if (!this.filtroNivel) return false; // Si no hay nivel, oculta todo
    if (this.filtroNivel.includes('Bachillerato') && !this.filtroFigura) return false; // Si es bachillerato pero no hay figura, oculta todo
    return true;
  }

  aplicarFiltros() {
    // Si el candado dice que no se debe mostrar, vaciamos la tabla y nos detenemos
    if (!this.mostrarResultados) {
      this.cursosMostrados = [];
      this.actualizarGrafico();
      return;
    }

    this.cursosMostrados = this.cursos.filter((curso) => {
      const coincideNivel = curso.nivel === this.filtroNivel;

      if (!this.filtroNivel.includes('Bachillerato')) {
        return coincideNivel;
      }

      const esTroncoComun = curso.area === 'Tronco Común' || !curso.figura_profesional;
      const coincideFigura = curso.figura_profesional === this.filtroFigura;

      return coincideNivel && (esTroncoComun || coincideFigura);
    });

    this.actualizarGrafico();
  }

  actualizarGrafico() {
    const nombresMaterias = this.cursosMostrados.map((c) => c.nombre);
    const horasSemanales = this.cursosMostrados.map((c) => c.horas_semanales);

    this.datosGrafico = {
      labels: nombresMaterias,
      datasets: [
        {
          label: 'Horas Semanales',
          backgroundColor: '#3b82f6',
          borderColor: '#1d4ed8',
          data: horasSemanales,
        },
      ],
    };
  }

  configurarOpcionesGrafico() {
    this.opcionesGrafico = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } },
    };
  }

  cursoVacio(): Curso {
    return {
      nombre: '',
      nivel: '1ro Bachillerato',
      area: '',
      tipo_modulo: 'Tronco Común',
      familia_profesional: null,
      figura_profesional: null,
      horas_semanales: 0,
    };
  }

  abrirModal() {
    this.nuevoCurso = this.cursoVacio();
    this.modoEdicion = false;
    this.mostrarModal = true;
  }

  abrirModalEditar(curso: Curso) {
    this.nuevoCurso = { ...curso };
    this.modoEdicion = true;
    this.mostrarModal = true;
  }

  eliminar(curso: Curso) {
    if (confirm(`¿Estás seguro de que deseas eliminar la asignatura: ${curso.nombre}?`)) {
      this.cursoService.eliminarCurso(curso.id!).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Eliminado',
            detail: 'Asignatura borrada.',
          });
          this.cargarCursos();
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

  guardarCurso() {
    this.nuevoCurso.nombre = this.nuevoCurso.nombre.toUpperCase();
    this.guardando = true;

    if (this.modoEdicion && this.nuevoCurso.id) {
      this.cursoService.actualizarCurso(this.nuevoCurso.id, this.nuevoCurso).subscribe({
        next: () => this.finalizarGuardado('¡Actualizado!', 'Asignatura editada correctamente.'),
        error: () => this.manejarErrorGuardado(),
      });
    } else {
      this.cursoService.crearCurso(this.nuevoCurso).subscribe({
        next: () =>
          this.finalizarGuardado('¡Éxito!', 'Asignatura guardada correctamente en la malla.'),
        error: () => this.manejarErrorGuardado(),
      });
    }
  }

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
