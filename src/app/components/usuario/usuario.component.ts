import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
@Component({
  selector: 'app-usuario',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule
  ],
  templateUrl: './usuario.component.html',
  styleUrl: './usuario.component.scss'
})
export class UsuarioComponent {
  displayedColumns: string[] = ['id', 'nombre', 'email', 'rol', 'estado', 'acciones'];
  dataSource = [
    { id: 1, nombre: 'Juan Pérez', email: 'juan@example.com', rol: 'Admin', estado: 'Activo' },
    { id: 2, nombre: 'María García', email: 'maria@example.com', rol: 'Usuario', estado: 'Activo' },
    { id: 3, nombre: 'Carlos López', email: 'carlos@example.com', rol: 'Usuario', estado: 'Inactivo' }
  ];
}
