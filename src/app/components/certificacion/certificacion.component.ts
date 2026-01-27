import { Component, OnInit, AfterViewInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { DistribuidorSelectorComponent } from '../shared/distribuidor-selector/distribuidor-selector.component';

@Component({
  selector: 'app-certificacion',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './certificacion.component.html',
  styleUrl: './certificacion.component.scss'
})
export class CertificacionComponent implements OnInit, AfterViewInit {
  currentYear: number = new Date().getFullYear();
  mobileMenuOpen: boolean = false;
  private dialog = inject(MatDialog);

  constructor(private router: Router) {}

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
}
