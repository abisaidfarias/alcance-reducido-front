import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService } from './api.service';
import { Usuario, UsuarioCreate, UsuarioUpdate } from '../models/usuario.interface';

interface UsersResponse {
  count: number;
  users: Usuario[];
}

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  constructor(private apiService: ApiService) { }

  getAll(): Observable<Usuario[]> {
    return this.apiService.get<UsersResponse | Usuario[]>('/users').pipe(
      map((response) => {
        // Si la respuesta es un objeto con 'users', extraer el array
        if (response && typeof response === 'object' && 'users' in response) {
          return (response as UsersResponse).users;
        }
        // Si ya es un array, devolverlo directamente
        if (Array.isArray(response)) {
          return response;
        }
        return [];
      })
    );
  }

  getById(id: string): Observable<Usuario> {
    return this.apiService.get<Usuario>(`/users/${id}`);
  }

  create(usuario: UsuarioCreate): Observable<Usuario> {
    return this.apiService.post<Usuario>('/users', usuario);
  }

  update(id: string, usuario: UsuarioUpdate): Observable<Usuario> {
    return this.apiService.put<Usuario>(`/users/${id}`, usuario);
  }

  delete(id: string): Observable<void> {
    return this.apiService.delete<void>(`/users/${id}`);
  }
}

