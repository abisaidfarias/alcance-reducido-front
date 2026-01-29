import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { UsuarioService } from '../../services/usuario.service';
import { Usuario } from '../../models/usuario.interface';
import { UsuarioFormComponent } from './usuario-form/usuario-form.component';
import { ConfirmDialogComponent, ConfirmDialogData } from '../shared/confirm-dialog/confirm-dialog.component';
import { ErrorDialogComponent, ErrorDialogData } from '../shared/error-dialog/error-dialog.component';

@Component({
  selector: 'app-usuario',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatDialogModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatTooltipModule
  ],
  templateUrl: './usuario.component.html',
  styleUrl: './usuario.component.scss'
})
export class UsuarioComponent implements OnInit {
  displayedColumns: string[] = ['nombre', 'email', 'rol', 'acciones'];
  dataSource: Usuario[] = [];
  loading = false;

  constructor(
    private usuarioService: UsuarioService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadUsuarios();
  }

  loadUsuarios(): void {
    this.loading = true;
    this.usuarioService.getAll().subscribe({
      next: (usuarios) => {
        console.log('Usuarios cargados:', usuarios);
        this.dataSource = usuarios || [];
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar usuarios:', error);
        this.dataSource = [];
        this.loading = false;
        this.showErrorDialog('Error al cargar usuarios', error);
      }
    });
  }

  openDialog(usuario?: Usuario): void {
    const dialogRef = this.dialog.open(UsuarioFormComponent, {
      width: '600px',
      data: usuario || null
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loading = true;
        if (usuario) {
          // Actualizar
          this.usuarioService.update(usuario._id!, result).subscribe({
            next: () => {
              this.snackBar.open('Usuario actualizado exitosamente', 'Cerrar', {
                duration: 3000
              });
              this.loadUsuarios();
            },
            error: (error) => {
              console.error('Error al actualizar usuario:', error);
              this.loading = false;
              this.showErrorDialog('Error al actualizar usuario', error);
            }
          });
        } else {
          // Crear
          this.usuarioService.create(result).subscribe({
            next: () => {
              this.snackBar.open('Usuario creado exitosamente', 'Cerrar', {
                duration: 3000
              });
              this.loadUsuarios();
            },
            error: (error) => {
              console.error('Error al crear usuario:', error);
              this.loading = false;
              this.showErrorDialog('Error al crear usuario', error);
            }
          });
        }
      }
    });
  }

  onRowClick(usuario: Usuario): void {
    // Al hacer click en la fila, abrir el modal de edición
    this.openDialog(usuario);
  }

  editUsuario(usuario: Usuario, event: Event): void {
    event.stopPropagation(); // Evitar que se active el click de la fila
    this.openDialog(usuario);
  }

  deleteUsuario(usuario: Usuario, event: Event): void {
    event.stopPropagation();
    
    const dialogData: ConfirmDialogData = {
      title: 'Confirmar eliminación',
      message: `¿Estás seguro de eliminar al usuario "${usuario.nombre}" (${usuario.email})? Esta acción no se puede deshacer.`,
      confirmText: 'Eliminar',
      cancelText: 'Cancelar'
    };

    const confirmDialog = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: dialogData
    });

    confirmDialog.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.loading = true;
        this.usuarioService.delete(usuario._id!).subscribe({
          next: () => {
            this.snackBar.open('Usuario eliminado exitosamente', 'Cerrar', {
              duration: 3000
            });
            this.loadUsuarios();
          },
          error: (error) => {
            console.error('Error al eliminar usuario:', error);
            this.loading = false;
            this.showErrorDialog('Error al eliminar usuario', error);
          }
        });
      }
    });
  }

  showErrorDialog(title: string, error: any): void {
    const errorData: ErrorDialogData = {
      title: title,
      message: error.error?.message || error.message || 'Ha ocurrido un error',
      error: error
    };

    this.dialog.open(ErrorDialogComponent, {
      width: '500px',
      data: errorData
    });
  }

  getRolDisplay(rol: string): string {
    const roles: { [key: string]: string } = {
      'usuario': 'Usuario',
      'admin': 'Administrador',
      'distribuidor': 'Distribuidor'
    };
    return roles[rol] || rol;
  }
}
