import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatChipsModule } from '@angular/material/chips';
import { UploadService } from '../../../services/upload.service';

@Component({
  selector: 'app-file-upload',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatTooltipModule,
    MatChipsModule
  ],
  templateUrl: './file-upload.component.html',
  styleUrl: './file-upload.component.scss'
})
export class FileUploadComponent implements OnInit {
  @Input() label: string = 'Archivo';
  @Input() currentUrl: string = '';
  @Output() urlChange = new EventEmitter<string>();

  selectedFile: File | null = null;
  uploadedUrl: string | null = null;
  uploading = false;
  uploadingFile: string | null = null;
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
      this.uploadedUrl = this.currentUrl;
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0]; // Solo tomar el primer archivo
      
      // Validar archivo
      const validation = this.uploadService.validateArchiveFile(file);
      if (!validation.valid) {
        this.error = validation.error || 'Error al validar el archivo';
        this.snackBar.open(this.error, 'Cerrar', { duration: 5000 });
        input.value = '';
        return;
      }

      this.selectedFile = file;
      this.error = null;
      // Subir automáticamente
      this.uploadFile(file);

      // Limpiar el input para permitir seleccionar el mismo archivo de nuevo
      input.value = '';
    }
  }

  uploadFile(file: File): void {
    if (!file) {
      return;
    }

    this.uploading = true;
    this.uploadingFile = file.name;
    this.error = null;

    // Enviamos el archivo en el campo 'image' y marcamos el tipo como 'testReport'
    this.uploadService.uploadFile(file, 'testReport').subscribe({
      next: (response) => {
        this.uploading = false;
        this.uploadingFile = null;
        
        if (response && response.success && response.url) {
          this.uploadedUrl = response.url;
          this.selectedFile = null;
          this.urlChange.emit(response.url);
          this.snackBar.open('Archivo subido exitosamente', 'Cerrar', { duration: 3000 });
        } else {
          this.error = 'Error al subir el archivo';
          this.snackBar.open(this.error, 'Cerrar', { duration: 5000 });
        }
      },
      error: (err) => {
        this.uploading = false;
        this.uploadingFile = null;
        const errorMessage = err?.error?.message || err?.message || 'Error al subir el archivo';
        this.error = errorMessage;
        this.snackBar.open(errorMessage, 'Cerrar', { duration: 5000 });
      }
    });
  }

  removeFile(): void {
    this.uploadedUrl = null;
    this.selectedFile = null;
    this.urlChange.emit('');
  }

  removeSelectedFile(): void {
    this.selectedFile = null;
  }

  triggerFileInput(): void {
    const fileInput = document.getElementById(this.fileInputId) as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
  }

  getFileName(url: string): string {
    if (!url) return '';
    try {
      const urlObj = new URL(url);
      const pathname = urlObj.pathname;
      const fileName = pathname.split('/').pop() || url;
      return decodeURIComponent(fileName);
    } catch {
      return url.split('/').pop() || url;
    }
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  }
}

