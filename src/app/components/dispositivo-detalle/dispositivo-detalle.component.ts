import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { DispositivoService } from '../../services/dispositivo.service';
import { AuthService } from '../../services/auth.service';
import { TranslationService, Language } from '../../services/translation.service';

@Component({
  selector: 'app-dispositivo-detalle',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './dispositivo-detalle.component.html',
  styleUrl: './dispositivo-detalle.component.scss'
})
export class DispositivoDetalleComponent implements OnInit {
  dispositivoId: string = '';
  dispositivo: any = null;
  loading = false;
  imageLoadError = false;
  currentLanguage: Language = 'es';

  authService: AuthService;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private dispositivoService: DispositivoService,
    authService: AuthService,
    public translationService: TranslationService
  ) {
    this.authService = authService;
    this.translationService.getCurrentLanguage().subscribe(lang => {
      this.currentLanguage = lang;
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.dispositivoId = params['id'] || '';
      this.loadDispositivo();
    });
  }

  loadDispositivo(): void {
    if (!this.dispositivoId) {
      this.router.navigate(['/']);
      return;
    }

    this.loading = true;
    this.dispositivoService.getPublicById(this.dispositivoId).subscribe({
      next: (response) => {
        console.log('Respuesta del dispositivo:', response);
        // Manejar diferentes formatos de respuesta
        if (response && response.dispositivo) {
          this.dispositivo = response.dispositivo;
        } else if (response && response.data) {
          this.dispositivo = response.data;
        } else if (response && response._id) {
          this.dispositivo = response;
        } else {
          this.dispositivo = null;
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar dispositivo:', error);
        this.loading = false;
        this.dispositivo = null;
        this.router.navigate(['/']);
      }
    });
  }

  goToHome(): void {
    this.router.navigate(['/']);
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }

  logout(): void {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    window.location.reload();
  }

  toggleLanguage(): void {
    const newLang: Language = this.currentLanguage === 'es' ? 'en' : 'es';
    this.translationService.setLanguage(newLang);
  }

  t(key: string): string {
    return this.translationService.translate(key);
  }

  get currentYear(): number {
    return new Date().getFullYear();
  }

  // --- Helpers para datos del dispositivo ---

  getMarcaNombre(): string {
    if (!this.dispositivo) return '';
    if (this.dispositivo.marca) {
      if (typeof this.dispositivo.marca === 'object') {
        return this.dispositivo.marca.marca || this.dispositivo.marca.fabricante || '';
      }
      return '';
    }
    return '';
  }

  getFabricanteNombre(): string {
    if (!this.dispositivo) return '';
    if (this.dispositivo.marca) {
      if (typeof this.dispositivo.marca === 'object') {
        return this.dispositivo.marca.fabricante || this.dispositivo.marca.marca || '';
      }
    }
    return '';
  }

  getDistribuidorNombre(): string {
    if (!this.dispositivo) return '';
    if (this.dispositivo.distribuidor) {
      if (typeof this.dispositivo.distribuidor === 'object') {
        return this.dispositivo.distribuidor.nombreRepresentante || this.dispositivo.distribuidor.representante || '';
      }
    }
    return '';
  }

  getDistribuidorEmail(): string {
    if (!this.dispositivo?.distribuidor) return '';
    if (typeof this.dispositivo.distribuidor === 'object') {
      return this.dispositivo.distribuidor.email || '';
    }
    return '';
  }

  getDistribuidorDomicilio(): string {
    if (!this.dispositivo?.distribuidor) return '';
    if (typeof this.dispositivo.distribuidor === 'object') {
      return this.dispositivo.distribuidor.domicilio || '';
    }
    return '';
  }

  getDistribuidorSitioWeb(): string {
    if (!this.dispositivo?.distribuidor) return '';
    if (typeof this.dispositivo.distribuidor === 'object') {
      return this.dispositivo.distribuidor.sitioWeb || '';
    }
    return '';
  }

  getFechaPublicacion(): string {
    if (!this.dispositivo) return 'No disponible';
    const fecha = this.dispositivo.fechaPublicacion;
    if (!fecha) return 'No disponible';
    try {
      const fechaDate = fecha instanceof Date ? fecha : new Date(fecha);
      if (isNaN(fechaDate.getTime())) return 'No disponible';
      const day = String(fechaDate.getDate()).padStart(2, '0');
      const month = String(fechaDate.getMonth() + 1).padStart(2, '0');
      const year = fechaDate.getFullYear();
      return `${day}/${month}/${year}`;
    } catch {
      return 'No disponible';
    }
  }

  getFechaCertificacionSubtel(): string {
    if (!this.dispositivo) return '—';
    const fecha = this.dispositivo.fechaCertificacionSubtel;
    if (!fecha) return '—';
    try {
      const fechaDate = fecha instanceof Date ? fecha : new Date(fecha);
      if (isNaN(fechaDate.getTime())) return '—';
      const day = String(fechaDate.getDate()).padStart(2, '0');
      const month = String(fechaDate.getMonth() + 1).padStart(2, '0');
      const year = fechaDate.getFullYear();
      return `${day}/${month}/${year}`;
    } catch {
      return '—';
    }
  }

  getWebsiteUrl(url: string): string {
    if (!url) return '';
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    return 'https://' + url;
  }

  hasTechnicalData(): boolean {
    if (!this.dispositivo) return false;
    return !!(
      this.dispositivo.tipo ||
      (this.dispositivo.tecnologia && this.dispositivo.tecnologia.length > 0) ||
      (this.dispositivo.frecuencias && this.dispositivo.frecuencias.length > 0) ||
      (this.dispositivo.gananciaAntena && this.dispositivo.gananciaAntena.length > 0) ||
      (this.dispositivo.EIRP && this.dispositivo.EIRP.length > 0) ||
      (this.dispositivo.modulo && this.dispositivo.modulo.length > 0) ||
      (this.dispositivo.nombreTestReport && this.dispositivo.nombreTestReport.length > 0) ||
      (this.dispositivo.testReportFiles && this.dispositivo.testReportFiles.trim() !== '')
    );
  }

  parseTestReport(reportString: string): { fileName: string, pages: string } {
    if (!reportString) return { fileName: '', pages: '' };
    const pagIndex = reportString.toLowerCase().indexOf('pag.');
    if (pagIndex === -1) return { fileName: reportString.trim(), pages: '' };
    const fileName = reportString.substring(0, pagIndex).trim();
    const pages = reportString.substring(pagIndex).trim();
    return { fileName, pages };
  }

  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    if (img) {
      img.onerror = null;
      this.imageLoadError = true;
    }
  }

  goToRepresentante(): void {
    const nombre = this.getDistribuidorNombre();
    if (nombre) {
      const encoded = encodeURIComponent(nombre);
      window.open(`${window.location.origin}/representante/${encoded}`, '_blank');
    }
  }
}
