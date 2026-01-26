import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isAuthenticated()) {
    router.navigate(['/login']);
    return false;
  }

  // Solo permitir acceso si es admin
  if (!authService.isAdmin()) {
    // Si no es admin, redirigir a la pantalla de representante
    const nombreRepresentante = authService.getRepresentanteNombre();
    if (nombreRepresentante) {
      const nombreEncoded = encodeURIComponent(nombreRepresentante);
      router.navigate(['/representante', nombreEncoded]);
    } else {
      // Si no se puede obtener el nombre, redirigir a login
      console.error('No se pudo obtener el nombre del representante en authGuard');
      router.navigate(['/login']);
    }
    return false;
  }

  return true;
};
