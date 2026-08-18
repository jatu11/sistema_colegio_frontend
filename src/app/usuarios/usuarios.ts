import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { UsuarioService, UsuarioDTO } from '../services/usuario';

import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    CardModule,
    InputTextModule,
    DropdownModule,
    ButtonModule,
    ToastModule,
  ],
  providers: [MessageService],
  templateUrl: './usuarios.html',
  styleUrl: './usuarios.css',
})
export class Usuarios {
  private usuarioService = inject(UsuarioService);
  private messageService = inject(MessageService);

  // Objeto para enlazar con el formulario
  nuevoUsuario: UsuarioDTO = this.usuarioVacio();
  guardando: boolean = false;

  // Listas desplegables
  roles = ['ADMINISTRACION', 'DOCENTE', 'INSPECTOR'];

  cargosAdministrativos = ['Rector', 'Vicerrector', 'Secretaria'];

  areas = [
    'Matemática',
    'Lengua y Literatura',
    'Ciencias Naturales',
    'Ciencias Sociales',
    'Lengua Extranjera',
    'Educación Física',
    'Educación Cultural y Artística',
    'Informática',
    'Contabilidad',
  ];

  usuarioVacio(): UsuarioDTO {
    return {
      cedula: '',
      nombres: '',
      apellidos: '',
      rol: 'DOCENTE',
      cargo: '',
      area_academica: '',
    };
  }

  // Limpia los campos dependientes si el usuario cambia de rol a mitad de camino
  alCambiarRol() {
    this.nuevoUsuario.cargo = '';
    this.nuevoUsuario.area_academica = '';

    // Si elige inspector, le asignamos el cargo automáticamente por comodidad
    if (this.nuevoUsuario.rol === 'INSPECTOR') {
      this.nuevoUsuario.cargo = 'Inspector General';
    } else if (this.nuevoUsuario.rol === 'DOCENTE') {
      this.nuevoUsuario.cargo = 'Docente Titular';
    }
  }

  guardarUsuario() {
    this.guardando = true;

    // Convertimos nombres a mayúsculas para mantener uniformidad en la base de datos
    const usuarioAEnviar = {
      ...this.nuevoUsuario,
      nombres: this.nuevoUsuario.nombres.toUpperCase(),
      apellidos: this.nuevoUsuario.apellidos.toUpperCase(),
    };

    this.usuarioService.registrarUsuario(usuarioAEnviar).subscribe({
      next: (res) => {
        this.guardando = false;
        // Mostramos el correo generado que nos devuelve el backend
        this.messageService.add({
          severity: 'success',
          summary: '¡Registrado!',
          detail: `Usuario creado. Correo: ${res.usuario.correo_institucional}`,
        });
        this.nuevoUsuario = this.usuarioVacio(); // Limpiamos el formulario
      },
      error: (err) => {
        this.guardando = false;
        const mensajeError = err.error?.message || 'Error al registrar el usuario.';
        this.messageService.add({ severity: 'error', summary: 'Error', detail: mensajeError });
      },
    });
  }
}
