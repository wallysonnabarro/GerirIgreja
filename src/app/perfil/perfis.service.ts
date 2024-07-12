import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PerfilListaPaginadaDto } from './perfil-lista-paginada-dto';
import { Result } from '../interfaces/Result';

@Injectable({
  providedIn: 'root'
})
export class PerfisService {

  private readonly uri: string = `${environment.apiUrl}perfil/`;
  
  constructor(private http: HttpClient) { }

  getPerfis(token: string, role: string): Observable<Result<PerfilListaPaginadaDto>>{
    const dados = {
      Perfils: role
    }
    
    let _headers: HttpHeaders = new HttpHeaders({
      'accept': 'application/json',
      'Authorization': `Bearer ${token}`,
      'Ocp-Apim-Subscription-Key': '1355424734c44ad2a6fca62712240920'
    });

    return this.http.post<Result<PerfilListaPaginadaDto>>(`${this.uri}perfil`, dados,  { headers: _headers });
  }
}
