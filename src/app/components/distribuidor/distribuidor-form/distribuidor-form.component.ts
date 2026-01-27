import { Component, Inject, OnInit, ViewEncapsulation, AfterViewInit, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Distribuidor } from '../../../models/distribuidor.interface';
import { ImageUploadComponent } from '../../shared/image-upload/image-upload.component';

@Component({
  selector: 'app-distribuidor-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    ImageUploadComponent
  ],
  templateUrl: './distribuidor-form.component.html',
  styleUrl: './distribuidor-form.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class DistribuidorFormComponent implements OnInit, AfterViewInit {
  distribuidorForm: FormGroup;
  isEditMode = false;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<DistribuidorFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Distribuidor | null,
    private elementRef: ElementRef
  ) {
    this.distribuidorForm = this.fb.group({
      representante: ['', [
        Validators.required,
        Validators.pattern(/^[a-zA-Z0-9]+$/) // Solo alfanuméricos
      ]],
      nombreRepresentante: ['', [Validators.required]],
      domicilio: [''],
      sitioWeb: [''],
      email: [''],
      logo: ['']
    });
  }

  ngOnInit(): void {
    if (this.data) {
      this.isEditMode = true;
      this.distribuidorForm.patchValue({
        representante: this.data.representante,
        nombreRepresentante: this.data.nombreRepresentante || '', // No copiar de representante, dejar vacío si no existe
        domicilio: this.data.domicilio || '',
        sitioWeb: this.data.sitioWeb || '',
        email: this.data.email || '',
        logo: this.data.logo || ''
      });
    }
  }

  onRepresentanteInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    // Remover cualquier carácter que no sea alfanumérico
    const value = input.value.replace(/[^a-zA-Z0-9]/g, '');
    if (input.value !== value) {
      this.distribuidorForm.patchValue({ representante: value }, { emitEvent: false });
    }
  }

  ngAfterViewInit(): void {
    // Aplicar border-radius directamente al contenedor del modal
    // Usar múltiples intentos para asegurar que se aplique
    const applyBorderRadius = () => {
      // Buscar todos los posibles contenedores
      const selectors = [
        '.mat-mdc-dialog-container',
        '.cdk-overlay-pane .mat-mdc-dialog-container',
        '.rounded-dialog .mat-mdc-dialog-container',
        'div.mat-mdc-dialog-container'
      ];
      
      selectors.forEach(selector => {
        const elements = document.querySelectorAll(selector) as NodeListOf<HTMLElement>;
        elements.forEach(element => {
          element.style.setProperty('border-radius', '8px', 'important');
          element.style.setProperty('overflow', 'hidden', 'important');
        });
      });
      
      // También buscar el overlay pane directamente
      const overlayPanes = document.querySelectorAll('.cdk-overlay-pane') as NodeListOf<HTMLElement>;
      overlayPanes.forEach(pane => {
        const container = pane.querySelector('.mat-mdc-dialog-container') as HTMLElement;
        if (container) {
          container.style.setProperty('border-radius', '8px', 'important');
          container.style.setProperty('overflow', 'hidden', 'important');
        }
      });
    };
    
    // Aplicar inmediatamente
    applyBorderRadius();
    
    // Aplicar después de un pequeño delay
    setTimeout(applyBorderRadius, 10);
    setTimeout(applyBorderRadius, 50);
    setTimeout(applyBorderRadius, 100);
    
    // Usar MutationObserver para detectar cuando se agrega el modal al DOM
    const observer = new MutationObserver(() => {
      applyBorderRadius();
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
    
    // Limpiar observer después de 2 segundos
    setTimeout(() => {
      observer.disconnect();
    }, 2000);
  }

  onSubmit(): void {
    // Validar formulario antes de enviar
    if (this.distribuidorForm.invalid) {
      // Marcar todos los campos como touched para mostrar errores
      Object.keys(this.distribuidorForm.controls).forEach(key => {
        this.distribuidorForm.get(key)?.markAsTouched();
      });
      return;
    }

    // Asegurar que nombreRepresentante esté presente
    const formValue = { ...this.distribuidorForm.value };
    if (!formValue.nombreRepresentante || formValue.nombreRepresentante.trim() === '') {
      this.distribuidorForm.get('nombreRepresentante')?.setErrors({ required: true });
      this.distribuidorForm.get('nombreRepresentante')?.markAsTouched();
      return;
    }

    // Asegurar que representante esté presente y válido
    if (!formValue.representante || formValue.representante.trim() === '') {
      this.distribuidorForm.get('representante')?.setErrors({ required: true });
      this.distribuidorForm.get('representante')?.markAsTouched();
      return;
    }

    // Limpiar espacios en blanco
    formValue.representante = formValue.representante.trim();
    formValue.nombreRepresentante = formValue.nombreRepresentante.trim();
    
    // Log para debugging (puedes removerlo después)
    console.log('Enviando distribuidor:', formValue);
    
    this.dialogRef.close(formValue);
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
