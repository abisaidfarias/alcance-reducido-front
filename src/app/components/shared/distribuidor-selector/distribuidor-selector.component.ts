import { Component, OnInit, inject, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { DistribuidorService } from '../../../services/distribuidor.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-distribuidor-selector',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatSelectModule,
    MatAutocompleteModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './distribuidor-selector.component.html',
  styleUrl: './distribuidor-selector.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class DistribuidorSelectorComponent implements OnInit {
  private distribuidorService = inject(DistribuidorService);
  private router = inject(Router);
  public dialogRef = inject(MatDialogRef<DistribuidorSelectorComponent>);
  public data = inject(MAT_DIALOG_DATA);

  distribuidores: any[] = [];
  distribuidoresFiltrados: any[] = [];
  loading = false;
  distribuidorControl = new FormControl('', [Validators.required]);
  distribuidorFilterControl = new FormControl('');

  ngOnInit(): void {
    this.loadDistribuidores();
    
    // Configurar filtro para autocomplete
    this.distribuidorFilterControl.valueChanges.subscribe(value => {
      this.filterDistribuidores(value || '');
    });
  }

  loadDistribuidores(): void {
    this.loading = true;
    this.distribuidorService.getNombres().subscribe({
      next: (response) => {
        this.loading = false;
        // Manejar diferentes formatos de respuesta - mantener objetos, no convertir a strings
        if (Array.isArray(response)) {
          this.distribuidores = response;
        } else if (response?.nombres && Array.isArray(response.nombres)) {
          this.distribuidores = response.nombres;
        } else if (response?.data && Array.isArray(response.data)) {
          this.distribuidores = response.data;
        } else if (response?.distribuidores && Array.isArray(response.distribuidores)) {
          this.distribuidores = response.distribuidores;
        } else {
          this.distribuidores = [];
        }
        this.distribuidoresFiltrados = this.distribuidores;
      },
      error: (error) => {
        console.error('Error al cargar distribuidores:', error);
        this.loading = false;
        this.distribuidores = [];
        this.distribuidoresFiltrados = [];
      }
    });
  }

  getDistributorLabel(d: any): string {
    if (!d) return '';
    if (typeof d === 'string') return d;
    return d?.nombreRepresentante ?? d?.nombre ?? d?.name ?? d?.razonSocial ?? d?.representante ?? d?.email ?? String(d ?? '');
  }

  getDistributorId(d: any): string {
    if (!d) return '';
    if (typeof d === 'string') return d;
    return d?._id ?? d?.id ?? d?.email ?? d?.nombre ?? d?.representante ?? String(d ?? '');
  }

  getSelectedDistributorLabel(): string {
    const selectedId = this.distribuidorControl.value;
    if (!selectedId) return '';
    const distribuidor = this.distribuidores.find(d => this.getDistributorId(d) === selectedId);
    return distribuidor ? this.getDistributorLabel(distribuidor) : '';
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSelect(): void {
    if (this.distribuidorControl.valid && this.distribuidorControl.value) {
      const selectedId = this.distribuidorControl.value;
      // Buscar el distribuidor por ID para obtener el nombre del representante
      const distribuidor = this.distribuidores.find(d => this.getDistributorId(d) === selectedId);
      
      // Obtener el nombre del representante para la redirección (usar 'representante', no 'nombreRepresentante')
      let nombreRepresentante: string;
      if (distribuidor) {
        // Priorizar el campo 'representante' para la redirección
        nombreRepresentante = distribuidor?.representante ?? distribuidor?.nombreRepresentante ?? distribuidor?.nombre ?? distribuidor?.name ?? this.getDistributorLabel(distribuidor);
      } else {
        nombreRepresentante = selectedId;
      }
      
      const nombreEncoded = encodeURIComponent(nombreRepresentante);
      const url = `${window.location.origin}/representante/${nombreEncoded}`;
      
      // Cerrar el modal primero
      this.dialogRef.close();
      
      // Abrir en nueva pestaña
      window.open(url, '_blank');
    }
  }


  // Filtrar distribuidores
  filterDistribuidores(search: string): void {
    const searchLower = search.toLowerCase().trim();
    if (!searchLower) {
      this.distribuidoresFiltrados = this.distribuidores;
      return;
    }
    this.distribuidoresFiltrados = this.distribuidores.filter(d => {
      const label = this.getDistributorLabel(d).toLowerCase();
      return label.includes(searchLower);
    });
  }

  // Manejar selección de distribuidor
  onDistribuidorSelected(distribuidorId: string): void {
    this.distribuidorControl.setValue(distribuidorId);
    const distribuidor = this.distribuidores.find(d => this.getDistributorId(d) === distribuidorId);
    if (distribuidor) {
      this.distribuidorFilterControl.setValue(
        this.getDistributorLabel(distribuidor),
        { emitEvent: false }
      );
    }
  }

  // Validar distribuidor al perder el foco
  onDistribuidorBlur(): void {
    const filterValue = this.distribuidorFilterControl.value || '';
    const distribuidorId = this.distribuidorControl.value;
    
    // Si hay un ID seleccionado, verificar que el texto coincida
    if (distribuidorId) {
      const distribuidor = this.distribuidores.find(d => this.getDistributorId(d) === distribuidorId);
      if (distribuidor) {
        const nombreCorrecto = this.getDistributorLabel(distribuidor);
        if (nombreCorrecto !== filterValue) {
          // El texto no coincide con el distribuidor seleccionado, limpiar
          this.distribuidorControl.setValue('');
          this.distribuidorFilterControl.setValue('', { emitEvent: false });
        } else {
          // Restaurar el texto correcto
          this.distribuidorFilterControl.setValue(nombreCorrecto, { emitEvent: false });
        }
      }
    } else {
      // No hay selección, verificar si el texto escrito coincide con algún distribuidor
      const distribuidorEncontrado = this.distribuidores.find(d => {
        const nombre = this.getDistributorLabel(d).toLowerCase();
        return nombre === filterValue.toLowerCase().trim();
      });
      if (!distribuidorEncontrado && filterValue.trim() !== '') {
        // El texto no coincide con ningún distribuidor, limpiar
        this.distribuidorFilterControl.setValue('', { emitEvent: false });
      }
    }
  }
}
