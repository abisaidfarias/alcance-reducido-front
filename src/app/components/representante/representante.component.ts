import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { DispositivoService } from '../../services/dispositivo.service';
import { Dispositivo } from '../../models/dispositivo.interface';
import { DistribuidorService } from '../../services/distribuidor.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-representante',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatIconModule,
    MatGridListModule,
    MatButtonModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './representante.component.html',
  styleUrl: './representante.component.scss'
})
export class RepresentanteComponent implements OnInit {
  nombreDistribuidor: string = '';
  distribuidor: any = null;
  marcas: any[] = [];
  marcasFiltradas: any[] = [];
  searchQuery: string = '';
  dispositivos: Dispositivo[] = [];
  dispositivosFiltrados: Dispositivo[] = [];
  searchQueryDispositivos: string = '';
  marcaSeleccionada: any | null = null;
  dispositivoSeleccionado: any | null = null;
  mostrarDispositivos = false;
  mostrarDetalleDispositivo = false;
  loading = false;
  tieneDatos = false;
  imageLoadError = false;
  
  // Exponer authService para usar en el template
  authService: AuthService;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private dispositivoService: DispositivoService,
    private distribuidorService: DistribuidorService,
    authService: AuthService
  ) {
    this.authService = authService;
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.nombreDistribuidor = decodeURIComponent(params['nombre'] || '');
      this.loadDistribuidorData();
    });
  }

  loadDistribuidorData(): void {
    this.loading = true;
    this.distribuidorService.getByRepresentante(this.nombreDistribuidor).subscribe({
      next: (response) => {
        console.log('Respuesta del distribuidor:', response);
        
        if (response && response.distribuidor) {
          const distribuidor = response.distribuidor;
          this.distribuidor = distribuidor; // Guardar información del distribuidor
          
          // Verificar si tiene marcas
          if (distribuidor.marcas && distribuidor.marcas.length > 0) {
            console.log('=== MARCAS Y DISPOSITIVOS ===');
            distribuidor.marcas.forEach((marca: any, index: number) => {
              console.log(`Marca ${index + 1}:`, marca.marca || marca.fabricante);
              if (marca.dispositivos && marca.dispositivos.length > 0) {
                console.log(`  Dispositivos: ${marca.dispositivos.length}`);
                marca.dispositivos.forEach((disp: any, dIndex: number) => {
                  console.log(`    Dispositivo ${dIndex + 1}:`, disp.modelo);
                  console.log(`      fechaPublicacion:`, disp.fechaPublicacion, 'tipo:', typeof disp.fechaPublicacion);
                });
              }
            });
            this.marcas = distribuidor.marcas;
            this.marcasFiltradas = [...this.marcas];
            this.tieneDatos = true;
          } else {
            // No tiene registros, solo mostrar el nombre
            this.marcas = [];
            this.marcasFiltradas = [];
            this.tieneDatos = false;
          }
        } else {
          this.marcas = [];
          this.tieneDatos = false;
          this.distribuidor = null;
        }
        
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar distribuidor:', error);
        this.loading = false;
        this.marcas = [];
        this.tieneDatos = false;
        
        // Redirigir a la página principal cuando el representante no existe
        this.router.navigate(['/']);
      }
    });
  }


  onMarcaClick(marca: any): void {
    this.marcaSeleccionada = marca;
    this.mostrarDispositivos = true;
    this.searchQueryDispositivos = '';
    
    // Los dispositivos vienen dentro de la marca desde el API
    if (marca.dispositivos && Array.isArray(marca.dispositivos)) {
      this.dispositivos = marca.dispositivos;
      this.dispositivosFiltrados = [...this.dispositivos];
    } else {
      this.dispositivos = [];
      this.dispositivosFiltrados = [];
    }
  }

  volverAtras(): void {
    if (this.mostrarDetalleDispositivo) {
      // Volver a la vista de dispositivos
      this.mostrarDetalleDispositivo = false;
      this.dispositivoSeleccionado = null;
    } else {
      // Volver a la vista de marcas
      this.mostrarDispositivos = false;
      this.marcaSeleccionada = null;
      this.dispositivos = [];
    }
  }

  volverADispositivos(): void {
    // Volver a la vista de dispositivos desde el detalle
    if (this.mostrarDetalleDispositivo) {
      this.mostrarDetalleDispositivo = false;
      this.dispositivoSeleccionado = null;
    }
  }

  onDispositivoClick(dispositivo: any): void {
    console.log('=== DISPOSITIVO SELECCIONADO ===');
    console.log('Dispositivo completo:', dispositivo);
    console.log('fechaPublicacion (tipo):', typeof dispositivo.fechaPublicacion);
    console.log('fechaPublicacion (valor):', dispositivo.fechaPublicacion);
    console.log('Todas las propiedades:', Object.keys(dispositivo));
    this.dispositivoSeleccionado = dispositivo;
    this.mostrarDetalleDispositivo = true;
    this.imageLoadError = false; // Resetear error de imagen al cambiar de dispositivo
  }

  getDispositivoImage(dispositivo: Dispositivo): string {
    // Si tiene foto, usarla; si no, usar imagen SVG inline como placeholder
    if (dispositivo.foto) {
      return dispositivo.foto;
    }
    // Imagen SVG inline bonita como placeholder
    return this.getDevicePlaceholderSVG();
  }

  encodeURI(text: string): string {
    return encodeURIComponent(text);
  }

  getPlaceholderImage(): string {
    // SVG inline bonito con icono de imagen
    return this.getImagePlaceholderSVG();
  }

  getImagePlaceholderSVG(): string {
    // SVG con icono de imagen/phone bonito
    const svg = `
      <svg width="120" height="120" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#f5f5f5"/>
        <g transform="translate(60, 60)">
          <rect x="-30" y="-30" width="60" height="60" rx="8" fill="#e0e0e0" stroke="#bdbdbd" stroke-width="2"/>
          <circle cx="0" cy="-10" r="8" fill="#9e9e9e"/>
          <rect x="-15" y="5" width="30" height="20" rx="2" fill="#9e9e9e"/>
        </g>
      </svg>
    `;
    return 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svg.trim())));
  }

  getDevicePlaceholderSVG(): string {
    // SVG con icono de teléfono bonito
    const svg = `
      <svg width="300" height="400" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#f5f5f5"/>
        <g transform="translate(150, 200)">
          <rect x="-40" y="-60" width="80" height="120" rx="12" fill="#e0e0e0" stroke="#bdbdbd" stroke-width="3"/>
          <rect x="-35" y="-55" width="70" height="90" rx="8" fill="#ffffff"/>
          <circle cx="0" cy="35" r="6" fill="#9e9e9e"/>
          <rect x="-20" y="-45" width="40" height="30" rx="4" fill="#e0e0e0"/>
        </g>
      </svg>
    `;
    return 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svg.trim())));
  }

  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    if (img) {
      // Evitar bucle infinito: remover el handler
      img.onerror = null;
      
      // Marcar que hubo un error para mostrar el placeholder
      this.imageLoadError = true;
    }
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }

  goToHome(): void {
    this.router.navigate(['/']);
  }

  logout(): void {
    // Limpiar la sesión manualmente
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    
    // Recargar la página actual (representante) en lugar de redirigir al login
    window.location.reload();
  }

  getFechaPublicacion(): string {
    if (!this.dispositivoSeleccionado) {
      return 'No disponible';
    }

    // El campo viene como fechaPublicacion desde la API (según el schema de Mongoose)
    const fecha = this.dispositivoSeleccionado.fechaPublicacion;

    if (!fecha) {
      console.warn('Fecha de publicación no encontrada en dispositivo:', this.dispositivoSeleccionado);
      console.warn('Campos disponibles:', Object.keys(this.dispositivoSeleccionado));
      return 'No disponible';
    }

    try {
      // La fecha puede venir como Date object o como string ISO
      const fechaDate = fecha instanceof Date ? fecha : new Date(fecha);
      
      if (isNaN(fechaDate.getTime())) {
        console.warn('Fecha inválida:', fecha, 'tipo:', typeof fecha);
        return 'No disponible';
      }
      
      // Formatear como dd/MM/yyyy
      const day = String(fechaDate.getDate()).padStart(2, '0');
      const month = String(fechaDate.getMonth() + 1).padStart(2, '0');
      const year = fechaDate.getFullYear();
      return `${day}/${month}/${year}`;
    } catch (error) {
      console.error('Error al formatear fecha:', error, 'fecha original:', fecha);
      return 'No disponible';
    }
  }

  getNombreRepresentante(): string {
    if (this.distribuidor && this.distribuidor.nombreRepresentante) {
      return this.distribuidor.nombreRepresentante;
    }
    // Fallback al nombreDistribuidor si no hay nombreRepresentante
    return this.nombreDistribuidor || 'Representante';
  }

  filterMarcas(): void {
    const query = (this.searchQuery || '').trim().toLowerCase();
    if (!query) {
      this.marcasFiltradas = [...this.marcas];
      return;
    }
    
    this.marcasFiltradas = this.marcas.filter(marca => {
      const nombreMarca = (marca.marca || marca.fabricante || '').toLowerCase();
      return nombreMarca.includes(query);
    });
  }

  get currentYear(): number {
    return new Date().getFullYear();
  }

  filterDispositivos(): void {
    const query = (this.searchQueryDispositivos || '').trim().toLowerCase();
    if (!query) {
      this.dispositivosFiltrados = [...this.dispositivos];
      return;
    }
    
    this.dispositivosFiltrados = this.dispositivos.filter(dispositivo => {
      const modelo = (dispositivo.modelo || '').toLowerCase();
      const nombreComercial = (dispositivo.nombreComercial || '').toLowerCase();
      return modelo.includes(query) || nombreComercial.includes(query);
    });
  }

  hasTechnicalData(): boolean {
    if (!this.dispositivoSeleccionado) return false;
    return !!(
      this.dispositivoSeleccionado.tipo ||
      (this.dispositivoSeleccionado.tecnologia && this.dispositivoSeleccionado.tecnologia.length > 0) ||
      (this.dispositivoSeleccionado.frecuencias && this.dispositivoSeleccionado.frecuencias.length > 0) ||
      (this.dispositivoSeleccionado.gananciaAntena && this.dispositivoSeleccionado.gananciaAntena.length > 0) ||
      (this.dispositivoSeleccionado.EIRP && this.dispositivoSeleccionado.EIRP.length > 0) ||
      (this.dispositivoSeleccionado.modulo && this.dispositivoSeleccionado.modulo.length > 0)
    );
  }

  getWebsiteUrl(url: string): string {
    if (!url) return '';
    // Si la URL ya tiene protocolo, devolverla tal cual
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    // Si no tiene protocolo, agregar https://
    return 'https://' + url;
  }
}
