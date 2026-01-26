import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

export interface UploadResponse {
  success: boolean;
  message: string;
  url: string;
  key?: string;
  size?: number;
  mimetype?: string;
  originalName?: string;
}

export interface MultipleUploadResponse {
  success: boolean;
  message: string;
  images: Array<{
    url: string;
    key: string;
    size: number;
    mimetype: string;
    originalName: string;
  }>;
}

@Injectable({
  providedIn: 'root'
})
export class UploadService {
  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  uploadImage(file: File): Observable<UploadResponse> {
    const formData = new FormData();
    formData.append('image', file);

    const token = this.authService.getToken();
    if (!token) {
      throw new Error('No hay token de autenticación');
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
      // NO incluir Content-Type, el navegador lo establecerá automáticamente con el boundary
    });

    // Usar environment.apiUrl directamente y agregar /upload
    // Desarrollo: http://localhost:3000/api/upload
    // Producción: https://api.alcance-reducido.com/api/upload
    const uploadUrl = `${environment.apiUrl}/upload`;
    console.log('Upload URL:', uploadUrl);
    return this.http.post<UploadResponse>(uploadUrl, formData, { headers });
  }

  uploadMultipleImages(files: File[]): Observable<MultipleUploadResponse> {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('images', file);
    });

    const token = this.authService.getToken();
    if (!token) {
      throw new Error('No hay token de autenticación');
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    // Usar environment.apiUrl directamente y agregar /upload/multiple
    // Desarrollo: http://localhost:3000/api/upload/multiple
    // Producción: https://api.alcance-reducido.com/api/upload/multiple
    const uploadUrl = `${environment.apiUrl}/upload/multiple`;
    console.log('Multiple Upload URL:', uploadUrl);
    return this.http.post<MultipleUploadResponse>(uploadUrl, formData, { headers });
  }

  validateFile(file: File): { valid: boolean; error?: string } {
    // Validar tamaño (5MB máximo)
    const maxSize = 5 * 1024 * 1024; // 5MB en bytes
    if (file.size > maxSize) {
      return { valid: false, error: 'El archivo es demasiado grande. Máximo 5MB' };
    }

    // Validar tipo
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return { valid: false, error: 'Tipo de archivo no permitido. Solo se permiten: JPEG, JPG, PNG, GIF, WEBP' };
    }

    return { valid: true };
  }
}
