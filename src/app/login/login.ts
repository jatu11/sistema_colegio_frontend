import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

// Módulos de diseño de PrimeNG
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { PasswordModule } from 'primeng/password';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, CardModule, InputTextModule, ButtonModule, PasswordModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  cedula: string = '';
  password: string = '';
  mensajeError: string = '';

  private http = inject(HttpClient);
  private router = inject(Router);

  iniciarSesion() {
    const credenciales = {
      cedula: this.cedula,
      password: this.password,
    };

    // Apuntamos al puerto 3000 donde vive NestJS
    this.http.post<any>('http://localhost:3000/auth/login', credenciales).subscribe({
      next: (respuesta) => {
        // Guardamos el token encriptado en el navegador
        localStorage.setItem('access_token', respuesta.access_token);
        localStorage.setItem('usuario_rol', respuesta.usuario.rol);

        // Lo enviamos al panel de control (que crearemos en el futuro)
        console.log('¡Login exitoso! Token guardado.');
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.mensajeError = 'Credenciales incorrectas o usuario inactivo';
        console.error(err);
      },
    });
  }
}
