import { Component, OnInit, AfterViewInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { DistribuidorSelectorComponent } from '../shared/distribuidor-selector/distribuidor-selector.component';
import { DispositivoSelectorComponent } from '../shared/dispositivo-selector/dispositivo-selector.component';
import { TranslationService, Language } from '../../services/translation.service';

@Component({
  selector: 'app-certificacion',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule],
  templateUrl: './certificacion.component.html',
  styleUrl: './certificacion.component.scss'
})
export class CertificacionComponent implements OnInit, AfterViewInit {
  currentYear: number = new Date().getFullYear();
  mobileMenuOpen: boolean = false;
  currentLanguage: Language = 'es';
  private dialog = inject(MatDialog);

  constructor(
    private router: Router,
    public translationService: TranslationService
  ) {
    this.translationService.getCurrentLanguage().subscribe(lang => {
      this.currentLanguage = lang;
    });
  }

  ngOnInit(): void {
    this.currentYear = new Date().getFullYear();
  }

  ngAfterViewInit(): void {
    this.initMobileMenu();
  }

  initMobileMenu(): void {
    // El menú móvil se maneja con Angular bindings
  }

  toggleMobileMenu(): void {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  closeMobileMenu(): void {
    this.mobileMenuOpen = false;
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }

  openDistribuidorSelector(): void {
    this.dialog.open(DistribuidorSelectorComponent, {
      width: '500px',
      maxWidth: '800px',
      disableClose: false,
      panelClass: 'glass-dialog',
      backdropClass: 'glass-dialog-backdrop'
    });
  }

  openDispositivoSelector(): void {
    this.dialog.open(DispositivoSelectorComponent, {
      width: '500px',
      maxWidth: '800px',
      disableClose: false,
      panelClass: 'glass-dialog',
      backdropClass: 'glass-dialog-backdrop'
    });
  }

  toggleLanguage(): void {
    const newLang: Language = this.currentLanguage === 'es' ? 'en' : 'es';
    this.translationService.setLanguage(newLang);
  }

  t(key: string): string {
    return this.translationService.translate(key);
  }

  formatText(key: string): string {
    const text = this.translationService.translate(key);
    return text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  }
}
