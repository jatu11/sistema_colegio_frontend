import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

// Componentes de diseño de PrimeNG
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ToolbarModule } from 'primeng/toolbar';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, ButtonModule, CardModule, ToolbarModule, RouterModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
  // Variables para guardar la información del usuario
  rolUsuario: string = '';
  nombreUsuario: string = '';

  constructor(private router: Router) {}

  ngOnInit() {
    this.extraerInfoUsuario();
  }

  extraerInfoUsuario() {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        // Desencriptamos el JWT tal como lo hicimos en el Guardián
        const payloadBase64Url = token.split('.')[1];
        const payloadBase64 = payloadBase64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
          window
            .atob(payloadBase64)
            .split('')
            .map(function (c) {
              return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            })
            .join(''),
        );

        const usuarioInfo = JSON.parse(jsonPayload);
        console.log('Información dentro del Token:', usuarioInfo);
        
        // Guardamos los datos para usarlos en el HTML
        this.rolUsuario = usuarioInfo.rol;

        // Opcional: Extraemos el primer nombre para darle la bienvenida
        this.nombreUsuario = usuarioInfo.nombres.split(' ')[0];
      } catch (e) {
        console.error('Error al leer el token en el dashboard');
      }
    }
  }

  cerrarSesion() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}
