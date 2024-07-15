import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { Result } from '../../interfaces/Result';
import { NovoPerfil } from './NovoPerfil';
import { Perfil } from './Perfil';
import { Pages } from '../../interfaces/pages';
import { PerfilTransacoes } from './PerfilTransacoes';
import { Perfils } from '../../interfaces/Perfils';
import { CabecalhoService } from '../../services/cabecalho/cabecalho.service';

@Injectable({
  providedIn: 'root'
})
export class PerfilServicesService {

  private readonly uri: string = `${environment.apiUrl}Perfil/`;

  constructor(private http: HttpClient, private cabecalhoServicos: CabecalhoService) { }
  
  postNovoPerfil(token: string, perfil: NovoPerfil): Observable<Result<number>>{

    let _headers = this.cabecalhoServicos.gerarCabecalho(token);

    return this.http.post<Result<number>>(`${this.uri}perfil-novo`, perfil, { headers: _headers });
  }

  postAtualizarPerfil(token: string, perfil: Perfil): Observable<Result<number>>{

    let _headers = this.cabecalhoServicos.gerarCabecalho(token);

    return this.http.post<Result<number>>(`${this.uri}perfil-atualizar`, perfil, { headers: _headers });
  }

  Lista(page: number, token: string): Observable<Result<Pages<PerfilTransacoes[]>>> {
    const wrapper = {
      Skip: page,
      PageSize: 10
    };

    let _headers = this.cabecalhoServicos.gerarCabecalho(token);

    return this.http.post<Result<Pages<PerfilTransacoes[]>>>(`${this.uri}lista-paginada`, wrapper, { headers: _headers });
  }

  ListaPerfilSelected(token: string): Observable<Result<Perfils[]>>{

    let _headers = this.cabecalhoServicos.gerarCabecalho(token);

    return this.http.get<Result<Perfils[]>>(`${this.uri}perfil-listaSelected`, { headers: _headers });
  }
}
