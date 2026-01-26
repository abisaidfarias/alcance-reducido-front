import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatGridListModule } from '@angular/material/grid-list';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatGridListModule
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  cards = [
    { title: 'Bienvenido', content: 'Has iniciado sesión correctamente', icon: 'check_circle', color: 'primary' },
    { title: 'Dashboard', content: 'Accede a tu panel de control', icon: 'dashboard', color: 'accent' },
    { title: 'Configuración', content: 'Personaliza tu experiencia', icon: 'settings', color: 'warn' }
  ];

  gridColumns = 3;
  rowHeight = '200px';
  gutterSize = '20px';

  constructor(private breakpointObserver: BreakpointObserver) {
    this.updateGrid();
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.updateGrid();
  }

  private updateGrid() {
    if (this.breakpointObserver.isMatched(Breakpoints.Handset)) {
      // Mobile
      this.gridColumns = 1;
      this.rowHeight = '180px';
      this.gutterSize = '16px';
    } else if (this.breakpointObserver.isMatched(Breakpoints.Tablet)) {
      // Tablet
      this.gridColumns = 2;
      this.rowHeight = '200px';
      this.gutterSize = '20px';
    } else {
      // Desktop
      this.gridColumns = 3;
      this.rowHeight = '200px';
      this.gutterSize = '20px';
    }
  }
}
