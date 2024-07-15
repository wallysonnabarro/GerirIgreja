import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { Result } from '../../interfaces/Result';
import { DadosReaderRelatorio } from '../../interfaces/DadosReaderRelatorio';
import { CabecalhoService } from '../../services/cabecalho/cabecalho.service';

@Injectable({
  providedIn: 'root'
})
export class ConfiguracoesService {
 
  private readonly uri: string = `${environment.apiUrl}Relatorios/`;

  constructor(private http: HttpClient, private cabecalhoServicos: CabecalhoService) { }

  registrarConfiguracoesConectados(token: string, dadosReaderRelatorio: DadosReaderRelatorio): Observable<Result<DadosReaderRelatorio>>{

    let _headers = this.cabecalhoServicos.gerarCabecalho(token);

    return this.http.post<Result<DadosReaderRelatorio>>(`${this.uri}reader-conectado-novo`, dadosReaderRelatorio, { headers: _headers });
  }
}

