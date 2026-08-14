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
  router = inject(Router);
  rolUsuario: string | null = '';

  ngOnInit() {
    // Al cargar la pantalla, extraemos el rol de la memoria del navegador
    this.rolUsuario = localStorage.getItem('usuario_rol');
  }

  cerrarSesion() {
    // 1. Destruimos las credenciales de la memoria
    localStorage.removeItem('access_token');
    localStorage.removeItem('usuario_rol');

    // 2. Expulsamos al usuario a la pantalla de acceso
    this.router.navigate(['/login']);
  }
}
