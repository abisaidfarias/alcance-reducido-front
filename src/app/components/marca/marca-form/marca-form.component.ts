import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Marca } from '../../../models/marca.interface';
import { ImageUploadComponent } from '../../shared/image-upload/image-upload.component';

@Component({
  selector: 'app-marca-form',
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
  templateUrl: './marca-form.component.html',
  styleUrl: './marca-form.component.scss'
})
export class MarcaFormComponent implements OnInit {
  marcaForm: FormGroup;
  isEditMode = false;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<MarcaFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Marca | null
  ) {
    this.marcaForm = this.fb.group({
      fabricante: [''],
      marca: [''],
      logo: ['']
    });
  }

  ngOnInit(): void {
    if (this.data) {
      this.isEditMode = true;
      this.marcaForm.patchValue({
        fabricante: this.data.fabricante,
        marca: this.data.marca,
        logo: this.data.logo || ''
      });
    }
  }

  onSubmit(): void {
    this.dialogRef.close(this.marcaForm.value);
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
