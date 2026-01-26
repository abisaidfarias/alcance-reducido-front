import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MarcaService } from '../../services/marca.service';
import { Marca } from '../../models/marca.interface';
import { MarcaFormComponent } from './marca-form/marca-form.component';
import { ConfirmDialogComponent, ConfirmDialogData } from '../shared/confirm-dialog/confirm-dialog.component';
import { ErrorDialogComponent, ErrorDialogData } from '../shared/error-dialog/error-dialog.component';

@Component({
  selector: 'app-marca',
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
  templateUrl: './marca.component.html',
  styleUrl: './marca.component.scss'
})
export class MarcaComponent implements OnInit {
  displayedColumns: string[] = ['fabricante', 'marca', 'logo', 'acciones'];
  dataSource: Marca[] = [];
  loading = false;

  constructor(
    private marcaService: MarcaService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadMarcas();
  }

  loadMarcas(): void {
    this.loading = true;
    console.log('Cargando marcas...');
    this.marcaService.getAll().subscribe({
      next: (data) => {
        console.log('Respuesta completa recibida:', data);
        console.log('Tipo de dato:', typeof data);
        console.log('Es array?', Array.isArray(data));
        
        // Manejar diferentes formatos de respuesta
        let marcas: Marca[] = [];
        
        if (Array.isArray(data)) {
          marcas = data;
        } else if (data && typeof data === 'object') {
          // Si la respuesta viene envuelta en un objeto (ej: { data: [...] })
          if ('marcas' in data && Array.isArray((data as any).marcas)) {
            marcas = (data as any).marcas;
          } else if ('data' in data && Array.isArray((data as any).data)) {
            marcas = (data as any).data;
          } else {
            console.warn('Formato de respuesta no reconocido:', data);
          }
        }
        
        console.log('Marcas procesadas:', marcas);
        console.log('Cantidad:', marcas.length);
        this.dataSource = marcas;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error completo al cargar marcas:', error);
        console.error('Status:', error.status);
        console.error('Status Text:', error.statusText);
        console.error('Error body:', error.error);
        this.dataSource = [];
        this.loading = false;
        this.showErrorDialog('Error al cargar marcas', error);
      }
    });
  }

  openDialog(marca?: Marca): void {
    const dialogRef = this.dialog.open(MarcaFormComponent, {
      width: '500px',
      data: marca || null
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loading = true;
        if (marca) {
          // Actualizar
          this.marcaService.update(marca._id!, result).subscribe({
            next: () => {
              this.snackBar.open('Marca actualizada exitosamente', 'Cerrar', {
                duration: 3000
              });
              this.loadMarcas();
            },
            error: (error) => {
              console.error('Error al actualizar marca:', error);
              this.loading = false;
              this.showErrorDialog('Error al actualizar marca', error);
            }
          });
        } else {
          // Crear
          this.marcaService.create(result).subscribe({
            next: (response) => {
              console.log('Marca creada:', response);
              this.snackBar.open('Marca creada exitosamente', 'Cerrar', {
                duration: 3000
              });
              // Recargar la lista de marcas
              this.loadMarcas();
            },
            error: (error) => {
              console.error('Error al crear marca:', error);
              this.loading = false;
              this.showErrorDialog('Error al crear marca', error);
            }
          });
        }
      }
    });
  }

  onRowClick(marca: Marca): void {
    // Al hacer click en la fila, abrir el modal de edición
    this.openDialog(marca);
  }

  editMarca(marca: Marca, event: Event): void {
    event.stopPropagation(); // Evitar que se active el click de la fila
    this.openDialog(marca);
  }

  deleteMarca(marca: Marca, event: Event): void {
    event.stopPropagation(); // Evitar que se active el click de la fila
    
    const dialogData: ConfirmDialogData = {
      title: 'Confirmar eliminación',
      message: `¿Estás seguro de eliminar la marca "${marca.marca}" del fabricante "${marca.fabricante}"? Esta acción no se puede deshacer.`,
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
        this.marcaService.delete(marca._id!).subscribe({
          next: () => {
            this.snackBar.open('Marca eliminada exitosamente', 'Cerrar', {
              duration: 3000
            });
            this.loadMarcas();
          },
          error: (error) => {
            console.error('Error al eliminar marca:', error);
            this.loading = false;
            this.showErrorDialog('Error al eliminar marca', error);
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

  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    if (img) {
      // Evitar bucle infinito: remover el handler y ocultar la imagen
      img.onerror = null;
      img.style.display = 'none';
    }
  }
}
