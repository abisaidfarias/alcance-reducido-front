import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  loginForm: FormGroup;
  hidePassword = true;
  loading = false;
  error = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    // Si ya está autenticado, redirigir según el tipo de usuario
    if (this.authService.isAuthenticated()) {
      this.redirectByUserType();
    }
    
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  private redirectByUserType(): void {
    if (this.authService.isAdmin()) {
      // Si es admin, redirigir a la plataforma administrativa
      this.router.navigate(['/admin/distribuidor']);
    } else {
      // Si NO es admin, redirigir a la pantalla de representante
      const nombreRepresentante = this.authService.getRepresentanteNombre();
      if (nombreRepresentante) {
        const nombreEncoded = encodeURIComponent(nombreRepresentante);
        this.router.navigate(['/representante', nombreEncoded]);
      } else {
        // Si no se puede obtener el nombre, redirigir a login con error
        console.error('No se pudo obtener el nombre del representante');
        this.router.navigate(['/login']);
      }
    }
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.loading = true;
      this.error = '';
      
      this.authService.login(this.loginForm.value).subscribe({
        next: (response) => {
          console.log('Login response:', response);
          console.log('User from response:', response.user);
          
          // Esperar un momento para asegurar que el usuario se guardó en localStorage
          setTimeout(() => {
            console.log('User from service:', this.authService.getUser());
            console.log('Is admin?', this.authService.isAdmin());
            
            // Redirigir según el tipo de usuario
            if (this.authService.isAdmin()) {
              // Si es admin, redirigir a la plataforma administrativa
              console.log('Redirecting to /admin/distribuidor (admin)');
              this.router.navigate(['/admin/distribuidor']);
            } else {
              // Si NO es admin, redirigir a la pantalla de representante
              console.log('Redirecting to /representante (non-admin)');
              const nombreRepresentante = this.authService.getRepresentanteNombre();
              if (nombreRepresentante) {
                const nombreEncoded = encodeURIComponent(nombreRepresentante);
                this.router.navigate(['/representante', nombreEncoded]);
              } else {
                // Si no se puede obtener el nombre, mostrar error
                console.error('No se pudo obtener el nombre del representante');
                this.error = 'No se pudo obtener la información del representante';
                this.loading = false;
                return;
              }
            }
            this.loading = false;
          }, 100);
        },
        error: (err) => {
          this.error = err.error?.message || 'Error al iniciar sesión';
          this.loading = false;
        }
      });
    }
  }
}
