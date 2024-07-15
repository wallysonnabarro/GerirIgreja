import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PerfilListaPaginadaDto } from './perfil-lista-paginada-dto';
import { Result } from '../interfaces/Result';
import { CabecalhoService } from '../services/cabecalho/cabecalho.service';

@Injectable({
  providedIn: 'root'
})
export class PerfisService {

  private readonly uri: string = `${environment.apiUrl}perfil/`;
  
  constructor(private http: HttpClient, private cabecalhoServicos: CabecalhoService) { }

  getPerfis(token: string, role: string): Observable<Result<PerfilListaPaginadaDto>>{
    const dados = {
      Perfils: role
    }

    let _headers = this.cabecalhoServicos.gerarCabecalho(token);

    return this.http.post<Result<PerfilListaPaginadaDto>>(`${this.uri}perfil`, dados,  { headers: _headers });
  }
}
