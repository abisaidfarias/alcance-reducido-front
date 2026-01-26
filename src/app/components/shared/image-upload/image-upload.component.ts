import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { UploadService } from '../../../services/upload.service';

@Component({
  selector: 'app-image-upload',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatTooltipModule
  ],
  templateUrl: './image-upload.component.html',
  styleUrl: './image-upload.component.scss'
})
export class ImageUploadComponent implements OnInit {
  @Input() label: string = 'Logo (URL)';
  @Input() currentUrl: string = '';
  @Input() formControl?: FormControl | any;
  @Output() urlChange = new EventEmitter<string>();

  selectedFile: File | null = null;
  previewUrl: string | null = null;
  uploading = false;
  error: string | null = null;
  fileInputId: string;

  constructor(
    private uploadService: UploadService,
    private snackBar: MatSnackBar
  ) {
    this.fileInputId = `file-input-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  ngOnInit(): void {
    if (this.currentUrl) {
      this.previewUrl = this.currentUrl;
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      
      // Validar archivo
      const validation = this.uploadService.validateFile(file);
      if (!validation.valid) {
        this.error = validation.error || 'Error al validar el archivo';
        this.snackBar.open(this.error, 'Cerrar', { duration: 5000 });
        return;
      }

      this.selectedFile = file;
      this.error = null;

      // Crear preview
      const reader = new FileReader();
      reader.onloadend = () => {
        this.previewUrl = reader.result as string;
      };
      reader.readAsDataURL(file);

      // Subir automáticamente
      this.uploadImage();
    }
  }

  uploadImage(): void {
    if (!this.selectedFile) {
      return;
    }

    this.uploading = true;
    this.error = null;

    this.uploadService.uploadImage(this.selectedFile).subscribe({
      next: (response) => {
        this.uploading = false;
        if (response.success && response.url) {
          // Actualizar el form control si existe
          if (this.formControl) {
            this.formControl.setValue(response.url);
          }
          // Emitir el evento
          this.urlChange.emit(response.url);
          this.snackBar.open('Imagen subida exitosamente', 'Cerrar', { duration: 3000 });
        } else {
          this.error = 'Error al subir la imagen';
          this.snackBar.open(this.error, 'Cerrar', { duration: 5000 });
        }
      },
      error: (err) => {
        this.uploading = false;
        console.error('=== ERROR AL SUBIR IMAGEN ===');
        console.error('Error completo:', err);
        console.error('Error URL:', err.url);
        console.error('Error status:', err.status);
        console.error('Error statusText:', err.statusText);
        console.error('Error message:', err.message);
        console.error('Error error:', err.error);
        
        // Si el error es de parsing, puede ser que el backend retorne HTML o texto
        if (err.message && err.message.includes('parsing')) {
          const errorMessage = 'Error: El servidor retornó una respuesta inválida. Verifica la URL del endpoint.';
          this.error = errorMessage;
          this.snackBar.open(errorMessage, 'Cerrar', { duration: 7000 });
        } else {
          const errorMessage = err.error?.message || err.message || 'Error al subir la imagen';
          this.error = errorMessage;
          this.snackBar.open(errorMessage, 'Cerrar', { duration: 5000 });
        }
      }
    });
  }

  removeImage(): void {
    this.selectedFile = null;
    this.previewUrl = this.currentUrl || null;
    if (this.formControl) {
      this.formControl.setValue('');
    }
    this.urlChange.emit('');
  }

  triggerFileInput(): void {
    const fileInput = document.getElementById(this.fileInputId) as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
  }
}
