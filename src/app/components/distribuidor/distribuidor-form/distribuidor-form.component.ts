import { Component, Inject, OnInit } from '@angular/core';
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
  styleUrl: './distribuidor-form.component.scss'
})
export class DistribuidorFormComponent implements OnInit {
  distribuidorForm: FormGroup;
  isEditMode = false;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<DistribuidorFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Distribuidor | null
  ) {
    this.distribuidorForm = this.fb.group({
      representante: [''],
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
        domicilio: this.data.domicilio || '',
        sitioWeb: this.data.sitioWeb || '',
        email: this.data.email || '',
        logo: this.data.logo || ''
      });
    }
  }

  onSubmit(): void {
    this.dialogRef.close(this.distribuidorForm.value);
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
