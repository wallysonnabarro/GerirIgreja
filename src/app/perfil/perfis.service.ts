import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PerfilListaPaginadaDto } from './perfil-lista-paginada-dto';

@Injectable({
  providedIn: 'root'
})
export class PerfisService {

  private readonly uri: string = `${environment.apiUrl}perfil/`;
  
  constructor(private http: HttpClient) { }

  getPerfis(token: string, role: string): Observable<PerfilListaPaginadaDto>{
    const dados = {
      Perfils: role
    }
    
    let _headers: HttpHeaders = new HttpHeaders({
      'accept': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    return this.http.post<PerfilListaPaginadaDto>(`${this.uri}perfil`, dados,  { headers: _headers });
  }
}
