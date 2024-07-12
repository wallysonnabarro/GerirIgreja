import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { Result } from '../../interfaces/Result';
import { DadosReaderRelatorio } from '../../interfaces/DadosReaderRelatorio';

@Injectable({
  providedIn: 'root'
})
export class ConfiguracoesService {
 
  private readonly uri: string = `${environment.apiUrl}Relatorios/`;

  constructor(private http: HttpClient) { }

  registrarConfiguracoesConectados(token: string, dadosReaderRelatorio: DadosReaderRelatorio): Observable<Result<DadosReaderRelatorio>>{

    let _headers: HttpHeaders = new HttpHeaders({
      'accept': 'application/json',
      'Authorization': `Bearer ${token}`,
      'Ocp-Apim-Subscription-Key': '1355424734c44ad2a6fca62712240920'
    });

    return this.http.post<Result<DadosReaderRelatorio>>(`${this.uri}reader-conectado-novo`, dadosReaderRelatorio, { headers: _headers });
  }
}

