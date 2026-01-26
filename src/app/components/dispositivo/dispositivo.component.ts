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
import { DispositivoService } from '../../services/dispositivo.service';
import { Dispositivo } from '../../models/dispositivo.interface';
import { DispositivoFormComponent } from './dispositivo-form/dispositivo-form.component';
import { ConfirmDialogComponent, ConfirmDialogData } from '../shared/confirm-dialog/confirm-dialog.component';
import { ErrorDialogComponent, ErrorDialogData } from '../shared/error-dialog/error-dialog.component';
import { DistribuidorService } from '../../services/distribuidor.service';
import { Distribuidor } from '../../models/distribuidor.interface';

@Component({
  selector: 'app-dispositivo',
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
  templateUrl: './dispositivo.component.html',
  styleUrl: './dispositivo.component.scss'
})
export class DispositivoComponent implements OnInit {
  displayedColumns: string[] = ['modelo', 'tipo', 'marca', 'distribuidores', 'fechaPublicacion', 'acciones'];
  dataSource: Dispositivo[] = [];
  distribuidores: Distribuidor[] = [];
  loading = false;

  constructor(
    private dispositivoService: DispositivoService,
    private distribuidorService: DistribuidorService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadDispositivos();
    this.loadDistribuidores();
  }

  loadDistribuidores(): void {
    this.distribuidorService.getAll().subscribe({
      next: (data) => {
        let distribuidores: Distribuidor[] = [];
        
        if (Array.isArray(data)) {
          distribuidores = data;
        } else if (data && typeof data === 'object') {
          if ('data' in data && Array.isArray((data as any).data)) {
            distribuidores = (data as any).data;
          } else if ('distribuidores' in data && Array.isArray((data as any).distribuidores)) {
            distribuidores = (data as any).distribuidores;
          }
        }
        
        this.distribuidores = distribuidores;
      },
      error: (error) => {
        console.error('Error al cargar distribuidores:', error);
        this.distribuidores = [];
      }
    });
  }

  loadDispositivos(): void {
    this.loading = true;
    console.log('Cargando dispositivos...');
    this.dispositivoService.getAll().subscribe({
      next: (data) => {
        console.log('Respuesta completa recibida:', data);
        console.log('Tipo de dato:', typeof data);
        console.log('Es array?', Array.isArray(data));
        
        // Manejar diferentes formatos de respuesta
        let dispositivos: Dispositivo[] = [];
        
        if (Array.isArray(data)) {
          dispositivos = data;
        } else if (data && typeof data === 'object') {
          // Si la respuesta viene envuelta en un objeto (ej: { data: [...] })
          if ('data' in data && Array.isArray((data as any).data)) {
            dispositivos = (data as any).data;
          } else if ('dispositivos' in data && Array.isArray((data as any).dispositivos)) {
            dispositivos = (data as any).dispositivos;
          } else {
            console.warn('Formato de respuesta no reconocido:', data);
          }
        }
        
        console.log('Dispositivos procesados:', dispositivos);
        console.log('Cantidad:', dispositivos.length);
        this.dataSource = dispositivos;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error completo al cargar dispositivos:', error);
        console.error('Status:', error.status);
        console.error('Status Text:', error.statusText);
        console.error('Error body:', error.error);
        this.dataSource = [];
        this.loading = false;
        this.showErrorDialog('Error al cargar dispositivos', error);
      }
    });
  }

  openDialog(dispositivo?: Dispositivo): void {
    const dialogRef = this.dialog.open(DispositivoFormComponent, {
      width: '600px',
      data: dispositivo || null
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loading = true;
        if (dispositivo) {
          // Actualizar
          this.dispositivoService.update(dispositivo._id!, result).subscribe({
            next: () => {
              this.snackBar.open('Dispositivo actualizado exitosamente', 'Cerrar', {
                duration: 3000
              });
              this.loadDispositivos();
            },
            error: (error) => {
              console.error('Error al actualizar dispositivo:', error);
              this.loading = false;
              this.showErrorDialog('Error al actualizar dispositivo', error);
            }
          });
        } else {
          // Crear
          this.dispositivoService.create(result).subscribe({
            next: (response) => {
              console.log('Dispositivo creado:', response);
              this.snackBar.open('Dispositivo creado exitosamente', 'Cerrar', {
                duration: 3000
              });
              // Recargar la lista de dispositivos
              this.loadDispositivos();
            },
            error: (error) => {
              console.error('Error al crear dispositivo:', error);
              this.loading = false;
              this.showErrorDialog('Error al crear dispositivo', error);
            }
          });
        }
      }
    });
  }

  onRowClick(dispositivo: Dispositivo): void {
    // Al hacer click en la fila, abrir el modal de edición
    this.openDialog(dispositivo);
  }

  editDispositivo(dispositivo: Dispositivo, event: Event): void {
    event.stopPropagation(); // Evitar que se active el click de la fila
    this.openDialog(dispositivo);
  }

  deleteDispositivo(dispositivo: Dispositivo, event: Event): void {
    event.stopPropagation(); // Evitar que se active el click de la fila
    
    const dialogData: ConfirmDialogData = {
      title: 'Confirmar eliminación',
      message: `¿Estás seguro de eliminar el dispositivo "${dispositivo.modelo}"? Esta acción no se puede deshacer.`,
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
        this.dispositivoService.delete(dispositivo._id!).subscribe({
          next: () => {
            this.snackBar.open('Dispositivo eliminado exitosamente', 'Cerrar', {
              duration: 3000
            });
            this.loadDispositivos();
          },
          error: (error) => {
            console.error('Error al eliminar dispositivo:', error);
            this.loading = false;
            this.showErrorDialog('Error al eliminar dispositivo', error);
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
      img.style.display = 'none';
    }
  }

  getMarcaDisplay(element: Dispositivo): string {
    if (!element.marca) {
      return '-';
    }
    // Si marca es un objeto (populado)
    if (typeof element.marca === 'object' && 'marca' in element.marca) {
      return (element.marca as any).marca;
    }
    // Si marca es solo un ID (string)
    return element.marca;
  }

  getDistribuidoresDisplay(element: Dispositivo): string {
    if (!element.distribuidores) {
      return '-';
    }
    
    let distribuidoresArray: any[] = [];
    
    // Manejar diferentes formatos de respuesta
    if (Array.isArray(element.distribuidores)) {
      distribuidoresArray = element.distribuidores;
    } else {
      return '-';
    }
    
    if (distribuidoresArray.length === 0) {
      return '-';
    }
    
    if (distribuidoresArray.length === 1) {
      // Si hay un solo distribuidor, mostrar su nombre
      const distribuidorItem = distribuidoresArray[0];
      
      // Si es un objeto con representante (populado)
      if (typeof distribuidorItem === 'object' && distribuidorItem !== null && 'representante' in distribuidorItem) {
        return distribuidorItem.representante;
      }
      
      // Si es solo un ID (string), buscar en la lista
      const distribuidorId = typeof distribuidorItem === 'string' ? distribuidorItem : distribuidorItem._id;
      const distribuidor = this.distribuidores.find(d => d._id === distribuidorId);
      return distribuidor ? distribuidor.representante : (distribuidorId || '-');
    } else {
      // Si hay más de uno, mostrar el número
      return `${distribuidoresArray.length} distribuidores`;
    }
  }
}
