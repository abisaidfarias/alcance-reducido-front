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
import { DispositivoService } from '../../../services/dispositivo.service';
import { TranslationService } from '../../../services/translation.service';

@Component({
  selector: 'app-dispositivo-selector',
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
  templateUrl: './dispositivo-selector.component.html',
  styleUrl: './dispositivo-selector.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class DispositivoSelectorComponent implements OnInit {
  private dispositivoService = inject(DispositivoService);
  private translationService = inject(TranslationService);
  public dialogRef = inject(MatDialogRef<DispositivoSelectorComponent>);
  public data = inject(MAT_DIALOG_DATA);

  dispositivos: any[] = [];
  dispositivosFiltrados: any[] = [];
  loading = false;
  dispositivoControl = new FormControl('', [Validators.required]);
  dispositivoFilterControl = new FormControl('');

  ngOnInit(): void {
    this.loadDispositivos();
    
    // Configurar filtro para autocomplete
    this.dispositivoFilterControl.valueChanges.subscribe(value => {
      this.filterDispositivos(value || '');
    });
  }

  loadDispositivos(): void {
    this.loading = true;
    this.dispositivoService.getPublic().subscribe({
      next: (response) => {
        this.loading = false;
        // Manejar diferentes formatos de respuesta
        if (Array.isArray(response)) {
          this.dispositivos = response;
        } else if (response?.dispositivos && Array.isArray(response.dispositivos)) {
          this.dispositivos = response.dispositivos;
        } else if (response?.data && Array.isArray(response.data)) {
          this.dispositivos = response.data;
        } else {
          this.dispositivos = [];
        }
        this.dispositivosFiltrados = this.dispositivos;
      },
      error: (error) => {
        console.error('Error al cargar dispositivos:', error);
        this.loading = false;
        this.dispositivos = [];
        this.dispositivosFiltrados = [];
      }
    });
  }

  getDispositivoLabel(d: any): string {
    if (!d) return '';
    if (typeof d === 'string') return d;
    return d?.modelo ?? d?.nombreComercial ?? d?.nombre ?? String(d ?? '');
  }

  getDispositivoId(d: any): string {
    if (!d) return '';
    if (typeof d === 'string') return d;
    return d?._id ?? d?.id ?? String(d ?? '');
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSelect(): void {
    if (this.dispositivoControl.valid && this.dispositivoControl.value) {
      const selectedId = this.dispositivoControl.value;
      const dispositivo = this.dispositivos.find(d => this.getDispositivoId(d) === selectedId);
      
      if (dispositivo) {
        const dispositivoId = this.getDispositivoId(dispositivo);
        const url = `${window.location.origin}/dispositivo/${dispositivoId}`;
        
        // Cerrar el modal primero
        this.dialogRef.close();
        
        // Abrir en nueva pestaña
        window.open(url, '_blank');
        return;
      }
      
      this.dialogRef.close();
    }
  }

  t(key: string): string {
    return this.translationService.translate(key);
  }

  // Filtrar dispositivos
  filterDispositivos(search: string): void {
    const searchLower = search.toLowerCase().trim();
    if (!searchLower) {
      this.dispositivosFiltrados = this.dispositivos;
      return;
    }
    this.dispositivosFiltrados = this.dispositivos.filter(d => {
      const label = this.getDispositivoLabel(d).toLowerCase();
      return label.includes(searchLower);
    });
  }

  // Manejar selección de dispositivo
  onDispositivoSelected(dispositivoId: string): void {
    this.dispositivoControl.setValue(dispositivoId);
    const dispositivo = this.dispositivos.find(d => this.getDispositivoId(d) === dispositivoId);
    if (dispositivo) {
      this.dispositivoFilterControl.setValue(
        this.getDispositivoLabel(dispositivo),
        { emitEvent: false }
      );
    }
  }

  // Validar dispositivo al perder el foco
  onDispositivoBlur(): void {
    const filterValue = this.dispositivoFilterControl.value || '';
    const dispositivoId = this.dispositivoControl.value;
    
    if (dispositivoId) {
      const dispositivo = this.dispositivos.find(d => this.getDispositivoId(d) === dispositivoId);
      if (dispositivo) {
        const nombreCorrecto = this.getDispositivoLabel(dispositivo);
        if (nombreCorrecto !== filterValue) {
          this.dispositivoControl.setValue('');
          this.dispositivoFilterControl.setValue('', { emitEvent: false });
        } else {
          this.dispositivoFilterControl.setValue(nombreCorrecto, { emitEvent: false });
        }
      }
    } else {
      const dispositivoEncontrado = this.dispositivos.find(d => {
        const nombre = this.getDispositivoLabel(d).toLowerCase();
        return nombre === filterValue.toLowerCase().trim();
      });
      if (!dispositivoEncontrado && filterValue.trim() !== '') {
        this.dispositivoFilterControl.setValue('', { emitEvent: false });
      }
    }
  }
}
