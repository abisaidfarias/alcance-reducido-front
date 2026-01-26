import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Marca, MarcaCreate, MarcaUpdate } from '../models/marca.interface';

@Injectable({
  providedIn: 'root'
})
export class MarcaService {

  constructor(private apiService: ApiService) { }

  getAll(): Observable<Marca[]> {
    return this.apiService.get<Marca[]>('/marcas');
  }

  getById(id: string): Observable<Marca> {
    return this.apiService.get<Marca>(`/marcas/${id}`);
  }

  create(marca: MarcaCreate): Observable<Marca> {
    return this.apiService.post<Marca>('/marcas', marca);
  }

  update(id: string, marca: MarcaUpdate): Observable<Marca> {
    return this.apiService.put<Marca>(`/marcas/${id}`, marca);
  }

  delete(id: string): Observable<void> {
    return this.apiService.delete<void>(`/marcas/${id}`);
  }
}
