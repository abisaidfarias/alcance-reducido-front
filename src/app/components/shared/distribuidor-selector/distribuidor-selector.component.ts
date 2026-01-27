import { Component, OnInit, inject, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
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
  loading = false;
  distribuidorControl = new FormControl('', [Validators.required]);

  ngOnInit(): void {
    this.loadDistribuidores();
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
      },
      error: (error) => {
        console.error('Error al cargar distribuidores:', error);
        this.loading = false;
        this.distribuidores = [];
      }
    });
  }

  getDistributorLabel(d: any): string {
    if (!d) return '';
    if (typeof d === 'string') return d;
    return d?.nombre ?? d?.name ?? d?.razonSocial ?? d?.representante ?? d?.email ?? String(d ?? '');
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
      
      // Obtener el nombre del representante (campo 'representante' del objeto)
      let nombreRepresentante: string;
      if (distribuidor) {
        // Priorizar el campo 'representante', luego otros campos
        nombreRepresentante = distribuidor?.representante ?? distribuidor?.nombre ?? distribuidor?.name ?? this.getDistributorLabel(distribuidor);
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

  onSelectOpened(open: boolean): void {
    if (!open) return;
    setTimeout(() => {
      const panel = document.querySelector('.cdk-overlay-pane .glass-select-panel');
      console.log('=== PANEL DEBUG ===');
      console.log('PANEL', panel);
      console.log('PANEL HTML', panel?.outerHTML);
      
      const listCandidates = panel?.querySelectorAll('.mdc-list, .mat-mdc-select-panel, .mdc-menu-surface, .cdk-virtual-scroll-viewport');
      console.log('CANDIDATES', listCandidates);
      
      listCandidates?.forEach(el => {
        const cs = getComputedStyle(el as Element);
        console.log('Element:', el.className);
        console.log('  maxH:', cs.maxHeight, 'h:', cs.height, 'overflowY:', cs.overflowY, 'overflow:', cs.overflow);
        console.log('  display:', cs.display, 'position:', cs.position);
      });
      
      // También verificar el panel mismo
      if (panel) {
        const panelCs = getComputedStyle(panel as Element);
        console.log('PANEL SELF - maxH:', panelCs.maxHeight, 'h:', panelCs.height, 'overflowY:', panelCs.overflowY, 'overflow:', panelCs.overflow);
      }
      console.log('=== END DEBUG ===');
    }, 0);
  }
}
