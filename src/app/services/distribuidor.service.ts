import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Distribuidor, DistribuidorCreate, DistribuidorUpdate } from '../models/distribuidor.interface';

@Injectable({
  providedIn: 'root'
})
export class DistribuidorService {

  constructor(private apiService: ApiService) { }

  getAll(): Observable<Distribuidor[]> {
    return this.apiService.get<Distribuidor[]>('/distribuidores');
  }

  getById(id: string): Observable<Distribuidor> {
    return this.apiService.get<Distribuidor>(`/distribuidores/${id}`);
  }

  create(distribuidor: DistribuidorCreate): Observable<Distribuidor> {
    return this.apiService.post<Distribuidor>('/distribuidores', distribuidor);
  }

  update(id: string, distribuidor: DistribuidorUpdate): Observable<Distribuidor> {
    return this.apiService.put<Distribuidor>(`/distribuidores/${id}`, distribuidor);
  }

  delete(id: string): Observable<void> {
    return this.apiService.delete<void>(`/distribuidores/${id}`);
  }

  getByRepresentante(representante: string): Observable<any> {
    const representanteEncoded = encodeURIComponent(representante);
    return this.apiService.get<any>(`/distribuidores/representante/${representanteEncoded}`);
  }

  getNombres(): Observable<any> {
    return this.apiService.get<any>('/distribuidores/nombres');
  }
}
