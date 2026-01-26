import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
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
    MatProgressSpinnerModule
  ],
  templateUrl: './distribuidor-selector.component.html',
  styleUrl: './distribuidor-selector.component.scss'
})
export class DistribuidorSelectorComponent implements OnInit {
  private distribuidorService = inject(DistribuidorService);
  private router = inject(Router);
  public dialogRef = inject(MatDialogRef<DistribuidorSelectorComponent>);
  public data = inject(MAT_DIALOG_DATA);

  distribuidores: string[] = [];
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
        // Manejar diferentes formatos de respuesta
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

  onCancel(): void {
    this.dialogRef.close();
  }

  onSelect(): void {
    if (this.distribuidorControl.valid && this.distribuidorControl.value) {
      const nombre = this.distribuidorControl.value;
      const nombreEncoded = encodeURIComponent(nombre);
      this.dialogRef.close();
      this.router.navigate(['/representante', nombreEncoded]);
    }
  }
}
