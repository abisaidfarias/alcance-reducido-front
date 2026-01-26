import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { ApiService } from './api.service';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token?: string;
  access_token?: string;
  user?: {
    _id?: string;
    email?: string;
    nombre?: string;
    representante?: string;
    name?: string;
    tipo?: string;
    role?: string;
    rol?: string; // Campo principal para determinar el rol del usuario
    [key: string]: any;
  };
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private tokenKey = 'auth_token';
  private userKey = 'auth_user';
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.hasToken());
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(
    private apiService: ApiService,
    private router: Router
  ) { }

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return new Observable(observer => {
      this.apiService.post<LoginResponse>('/auth/login', credentials).subscribe({
        next: (response) => {
          const token = response.token || response.access_token;
          if (token) {
            localStorage.setItem(this.tokenKey, token);
            // Guardar información del usuario
            if (response.user) {
              localStorage.setItem(this.userKey, JSON.stringify(response.user));
            }
            this.isAuthenticatedSubject.next(true);
          }
          observer.next(response);
          observer.complete();
        },
        error: (error) => {
          observer.error(error);
        }
      });
    });
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
    this.isAuthenticatedSubject.next(false);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  getUser(): any {
    const userStr = localStorage.getItem(this.userKey);
    return userStr ? JSON.parse(userStr) : null;
  }

  getUserType(): string | null {
    const user = this.getUser();
    if (!user) return null;
    // Intentar obtener el tipo de usuario de diferentes campos posibles
    // El campo en el API es 'rol' (sin 'e')
    const userType = user.rol || user.tipo || user.role || user.userType || user.tipoUsuario || null;
    console.log('User object:', user);
    console.log('User type found:', userType);
    return userType;
  }

  isAdmin(): boolean {
    const userType = this.getUserType();
    // Verificar si es admin (puede venir como 'admin' o 'admi' si está truncado)
    const isAdminResult = userType?.toLowerCase().startsWith('admin') || userType?.toLowerCase() === 'admin';
    console.log('Is admin check:', { userType, isAdminResult });
    return isAdminResult;
  }

  /**
   * Obtiene el nombre del representante del usuario actual
   * Intenta obtenerlo de diferentes campos posibles del objeto user
   */
  getRepresentanteNombre(): string | null {
    const user = this.getUser();
    if (!user) return null;
    
    // Intentar obtener el nombre del representante de diferentes campos
    // Prioridad: nombre > representante > email (sin dominio) > null
    const nombre = user.nombre || user.representante || user.name || null;
    
    if (nombre) {
      return nombre;
    }
    
    // Si no hay nombre, usar email como fallback (extraer la parte antes del @)
    if (user.email) {
      return user.email.split('@')[0];
    }
    
    return null;
  }

  hasToken(): boolean {
    return !!this.getToken();
  }

  isAuthenticated(): boolean {
    return this.hasToken();
  }
}
