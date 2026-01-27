import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Dispositivo, DispositivoCreate, DispositivoUpdate } from '../models/dispositivo.interface';

@Injectable({
  providedIn: 'root'
})
export class DispositivoService {
  private endpoint = '/dispositivos';

  constructor(private apiService: ApiService) {}

  getAll(): Observable<Dispositivo[]> {
    return this.apiService.get<Dispositivo[]>(this.endpoint);
  }

  getById(id: string): Observable<Dispositivo> {
    return this.apiService.get<Dispositivo>(`${this.endpoint}/${id}`);
  }

  create(dispositivo: DispositivoCreate): Observable<Dispositivo> {
    return this.apiService.post<Dispositivo>(this.endpoint, dispositivo);
  }

  update(id: string, dispositivo: DispositivoUpdate): Observable<Dispositivo> {
    return this.apiService.put<Dispositivo>(`${this.endpoint}/${id}`, dispositivo);
  }

  delete(id: string): Observable<void> {
    return this.apiService.delete<void>(`${this.endpoint}/${id}`);
  }
}





