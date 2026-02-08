import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  // Página principal pública (landing page)
  {
    path: '',
    loadComponent: () => import('./components/certificacion/certificacion.component').then(m => m.CertificacionComponent)
  },
  // Rutas públicas
  {
    path: 'login',
    loadComponent: () => import('./components/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'representante/:nombre',
    loadComponent: () => import('./components/representante/representante.component').then(m => m.RepresentanteComponent)
  },
  {
    path: 'dispositivo/:id',
    loadComponent: () => import('./components/dispositivo-detalle/dispositivo-detalle.component').then(m => m.DispositivoDetalleComponent)
  },
  // Redirección especial: /fabricante/infinix -> /representante/luxuryspa
  {
    path: 'fabricante/infinix',
    redirectTo: '/representante/luxuryspa',
    pathMatch: 'full'
  },
  // Plataforma administrativa (requiere autenticación)
  {
    path: 'admin',
    loadComponent: () => import('./components/layout/layout.component').then(m => m.LayoutComponent),
    canActivate: [authGuard],
    children: [
      {
        path: 'home',
        loadComponent: () => import('./components/home/home.component').then(m => m.HomeComponent)
      },
      {
        path: 'distribuidor',
        loadComponent: () => import('./components/distribuidor/distribuidor.component').then(m => m.DistribuidorComponent)
      },
      {
        path: 'marca',
        loadComponent: () => import('./components/marca/marca.component').then(m => m.MarcaComponent)
      },
      {
        path: 'dispositivo',
        loadComponent: () => import('./components/dispositivo/dispositivo.component').then(m => m.DispositivoComponent)
      },
      {
        path: 'usuario',
        loadComponent: () => import('./components/usuario/usuario.component').then(m => m.UsuarioComponent)
      },
      {
        path: '',
        redirectTo: 'distribuidor',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '**',
    redirectTo: ''
  }
];
