import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Result } from '../../interfaces/Result';
import { Observable } from 'rxjs';
import { DadosRelatorio } from './DadosRelatorio';
import { CabecalhoService } from '../../services/cabecalho/cabecalho.service';

@Injectable({
  providedIn: 'root'
})
export class CheckInService {
 
  private readonly uri: string = `${environment.apiUrl}Relatorios/`;
  
  constructor(private http: HttpClient, private cabecalhoServicos: CabecalhoService) { }

  getVoluntarios(token: string, tipo: number, siao: number): Observable<Result<DadosRelatorio>>{
    const dados = {
      siao: siao,
      tipo: tipo
    } 
 
    let _headers = this.cabecalhoServicos.gerarCabecalho(token);

    return this.http.post<Result<DadosRelatorio>>(`${this.uri}get-lista-voluntarios`, dados,  { headers: _headers });
  }
  
  getConectados(token: string, tipo: number, siao: number, sexo: number): Observable<Result<DadosRelatorio>>{
    const dados = {
      siao: siao,
      tipo: tipo,
      sexo: sexo,
    } 
 
    let _headers = this.cabecalhoServicos.gerarCabecalho(token);

    return this.http.post<Result<DadosRelatorio>>(`${this.uri}get-lista-conectados`, dados,  { headers: _headers });
  }
}
