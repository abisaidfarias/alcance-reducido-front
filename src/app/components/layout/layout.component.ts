import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AuthService } from '../../services/auth.service';

interface MenuItem {
  label: string;
  icon: string;
  route: string;
}

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatSidenavModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatTooltipModule
  ],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss'
})
export class LayoutComponent implements OnInit, OnDestroy {
  opened = true;
  mode: 'side' | 'over' | 'push' = 'side';
  private destroy$ = new Subject<void>();

  menuItems: MenuItem[] = [
    { label: 'Distribuidor', icon: 'store', route: '/admin/distribuidor' },
    { label: 'Marca', icon: 'label', route: '/admin/marca' },
    { label: 'Dispositivo', icon: 'devices', route: '/admin/dispositivo' },
    { label: 'QR', icon: 'qr_code', route: '/admin/qr' },
    { label: 'Usuario', icon: 'person', route: '/admin/usuario' }
  ];

  constructor(
    private authService: AuthService,
    private router: Router,
    private breakpointObserver: BreakpointObserver
  ) {}

  ngOnInit(): void {
    this.breakpointObserver
      .observe([Breakpoints.Handset, Breakpoints.Tablet])
      .pipe(takeUntil(this.destroy$))
      .subscribe(result => {
        if (result.matches) {
          // Mobile/Tablet
          this.mode = 'over';
          this.opened = false;
        } else {
          // Desktop
          this.mode = 'side';
          this.opened = true;
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  toggleSidenav(): void {
    this.opened = !this.opened;
  }

  closeSidenavOnMobile(): void {
    if (this.mode === 'over') {
      this.opened = false;
    }
  }

  logout(): void {
    this.authService.logout();
  }
}
