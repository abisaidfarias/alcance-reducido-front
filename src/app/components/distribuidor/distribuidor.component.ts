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
import { DistribuidorService } from '../../services/distribuidor.service';
import { Distribuidor } from '../../models/distribuidor.interface';
import { DistribuidorFormComponent } from './distribuidor-form/distribuidor-form.component';
import { ConfirmDialogComponent, ConfirmDialogData } from '../shared/confirm-dialog/confirm-dialog.component';
import { ErrorDialogComponent, ErrorDialogData } from '../shared/error-dialog/error-dialog.component';
import { QrSizeDialogComponent } from '../shared/qr-size-dialog/qr-size-dialog.component';
import { environment } from '../../../environments/environment';
import * as QRCode from 'qrcode';

@Component({
  selector: 'app-distribuidor',
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
  templateUrl: './distribuidor.component.html',
  styleUrl: './distribuidor.component.scss'
})
export class DistribuidorComponent implements OnInit {
  displayedColumns: string[] = ['representante', 'domicilio', 'sitioWeb', 'email', 'dispositivos', 'acciones'];
  dataSource: Distribuidor[] = [];
  loading = false;

  constructor(
    private distribuidorService: DistribuidorService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadDistribuidores();
  }

  loadDistribuidores(): void {
    this.loading = true;
    console.log('Cargando distribuidores...');
    this.distribuidorService.getAll().subscribe({
      next: (data) => {
        console.log('Respuesta completa recibida:', data);
        console.log('Tipo de dato:', typeof data);
        console.log('Es array?', Array.isArray(data));
        
        // Manejar diferentes formatos de respuesta
        let distribuidores: Distribuidor[] = [];
        
        if (Array.isArray(data)) {
          distribuidores = data;
        } else if (data && typeof data === 'object') {
          // Si la respuesta viene envuelta en un objeto (ej: { data: [...] })
          if ('data' in data && Array.isArray((data as any).data)) {
            distribuidores = (data as any).data;
          } else if ('distribuidores' in data && Array.isArray((data as any).distribuidores)) {
            distribuidores = (data as any).distribuidores;
          } else {
            console.warn('Formato de respuesta no reconocido:', data);
          }
        }
        
        console.log('Distribuidores procesados:', distribuidores);
        console.log('Cantidad:', distribuidores.length);
        this.dataSource = distribuidores;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error completo al cargar distribuidores:', error);
        console.error('Status:', error.status);
        console.error('Status Text:', error.statusText);
        console.error('Error body:', error.error);
        this.dataSource = [];
        this.loading = false;
        this.showErrorDialog('Error al cargar distribuidores', error);
      }
    });
  }

  openDialog(distribuidor?: Distribuidor): void {
    const dialogRef = this.dialog.open(DistribuidorFormComponent, {
      width: '650px',
      maxWidth: '95vw',
      panelClass: 'rounded-dialog',
      data: distribuidor || null
    });
    
    // Aplicar border-radius después de que el modal se abra
    dialogRef.afterOpened().subscribe(() => {
      try {
        setTimeout(() => {
          const dialogContainer = document.querySelector('.mat-mdc-dialog-container') as HTMLElement;
          if (dialogContainer) {
            dialogContainer.style.setProperty('border-radius', '8px', 'important');
            dialogContainer.style.setProperty('overflow', 'hidden', 'important');
          }
        }, 0);
      } catch (error) {
        console.error('Error aplicando border-radius:', error);
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Validar que nombreRepresentante esté presente
        if (!result.nombreRepresentante || result.nombreRepresentante.trim() === '') {
          this.snackBar.open('El nombre del representante es requerido', 'Cerrar', {
            duration: 3000
          });
          return;
        }

        // Validar que representante esté presente
        if (!result.representante || result.representante.trim() === '') {
          this.snackBar.open('El identificador es requerido', 'Cerrar', {
            duration: 3000
          });
          return;
        }

        // Preparar datos para enviar
        const distribuidorData: any = {
          representante: result.representante.trim(),
          nombreRepresentante: result.nombreRepresentante.trim(),
          domicilio: result.domicilio || '',
          sitioWeb: result.sitioWeb || '',
          email: result.email || '',
          logo: result.logo || ''
        };

        console.log('Datos a enviar:', distribuidorData);

        this.loading = true;
        if (distribuidor) {
          // Actualizar
          this.distribuidorService.update(distribuidor._id!, distribuidorData).subscribe({
            next: () => {
              this.snackBar.open('Distribuidor actualizado exitosamente', 'Cerrar', {
                duration: 3000
              });
              this.loadDistribuidores();
            },
            error: (error) => {
              console.error('Error al actualizar distribuidor:', error);
              console.error('Datos enviados:', distribuidorData);
              this.loading = false;
              this.showErrorDialog('Error al actualizar distribuidor', error);
            }
          });
        } else {
          // Crear
          this.distribuidorService.create(distribuidorData).subscribe({
            next: (response) => {
              console.log('Distribuidor creado:', response);
              this.snackBar.open('Distribuidor creado exitosamente', 'Cerrar', {
                duration: 3000
              });
              // Recargar la lista de distribuidores
              this.loadDistribuidores();
            },
            error: (error) => {
              console.error('Error al crear distribuidor:', error);
              console.error('Datos enviados:', distribuidorData);
              this.loading = false;
              this.showErrorDialog('Error al crear distribuidor', error);
            }
          });
        }
      }
    });
  }

  onRowClick(distribuidor: Distribuidor): void {
    // Al hacer click en la fila, abrir el modal de edición
    this.openDialog(distribuidor);
  }

  editDistribuidor(distribuidor: Distribuidor, event: Event): void {
    event.stopPropagation(); // Evitar que se active el click de la fila
    this.openDialog(distribuidor);
  }

  deleteDistribuidor(distribuidor: Distribuidor, event: Event): void {
    event.stopPropagation(); // Evitar que se active el click de la fila
    
    const dialogData: ConfirmDialogData = {
      title: 'Confirmar eliminación',
      message: `¿Estás seguro de eliminar a "${distribuidor.nombreRepresentante || distribuidor.representante}"? Esta acción no se puede deshacer.`,
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
        this.distribuidorService.delete(distribuidor._id!).subscribe({
          next: () => {
            this.snackBar.open('Distribuidor eliminado exitosamente', 'Cerrar', {
              duration: 3000
            });
            this.loadDistribuidores();
          },
          error: (error) => {
            console.error('Error al eliminar distribuidor:', error);
            this.loading = false;
            this.showErrorDialog('Error al eliminar distribuidor', error);
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

  getRepresentanteUrl(distribuidor: Distribuidor): string {
    const baseUrl = environment.appUrl || window.location.origin;
    const nombreEncoded = encodeURIComponent(distribuidor.representante);
    return `${baseUrl}/representante/${nombreEncoded}`;
  }

  openRepresentanteUrl(distribuidor: Distribuidor, event: Event): void {
    event.stopPropagation();
    const url = this.getRepresentanteUrl(distribuidor);
    window.open(url, '_blank');
  }

  generateQR(distribuidor: Distribuidor, event: Event): void {
    event.stopPropagation();
    
    const qrUrl = this.getRepresentanteUrl(distribuidor);
    
    // Abrir modal para seleccionar tamaño
    const dialogRef = this.dialog.open(QrSizeDialogComponent, {
      width: '420px',
      maxWidth: '95vw',
      panelClass: 'rounded-dialog',
      data: { url: qrUrl }
    });

    dialogRef.afterClosed().subscribe((selectedSize: number | null) => {
      if (!selectedSize) return;
      this.doGenerateQR(distribuidor, qrUrl, selectedSize);
    });
  }

  private doGenerateQR(distribuidor: Distribuidor, qrUrl: string, qrSize: number): void {
    // Generar el QR como imagen con el tamaño seleccionado
    QRCode.toDataURL(qrUrl, {
      width: qrSize,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    }).then((qrDataUrl: string) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        throw new Error('No se pudo obtener el contexto del canvas');
      }
      
      const qrImage = new Image();
      qrImage.src = qrDataUrl;
      
      qrImage.onload = () => {
        const padding = Math.round(qrSize * 0.06);
        const fontSize = Math.max(10, Math.round(qrSize * 0.04));
        const textHeight = Math.round(qrSize * 0.18);
        
        canvas.width = qrSize + (padding * 2);
        canvas.height = qrSize + (padding * 2) + textHeight;
        
        // Fondo blanco
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Dibujar el QR
        ctx.drawImage(qrImage, padding, padding, qrSize, qrSize);
        
        // Texto debajo del QR
        ctx.fillStyle = '#000000';
        ctx.font = `bold ${fontSize}px Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        
        const lineSpacing = Math.round(fontSize * 1.5);
        const textY = qrSize + padding + Math.round(padding * 0.5);
        ctx.fillText('Escanea aquí para información', canvas.width / 2, textY);
        ctx.fillText('sobre el Alcance Reducido', canvas.width / 2, textY + lineSpacing);
        
        // Descargar
        canvas.toBlob((blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.download = `QR_${distribuidor.representante.replace(/[^a-z0-9]/gi, '_')}_${qrSize}px.png`;
            link.href = url;
            link.click();
            URL.revokeObjectURL(url);
            
            this.snackBar.open('QR generado y descargado exitosamente', 'Cerrar', {
              duration: 3000
            });
          }
        }, 'image/png');
      };
      
      qrImage.onerror = () => {
        throw new Error('Error al cargar la imagen del QR');
      };
    }).catch((error: any) => {
      console.error('Error al generar QR:', error);
      this.snackBar.open('Error al generar el QR', 'Cerrar', {
        duration: 3000
      });
    });
  }
}
