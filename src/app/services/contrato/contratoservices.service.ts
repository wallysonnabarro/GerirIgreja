import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { ContratoSelected } from '../../interfaces/ContratoSelected';
import { Observable } from 'rxjs';
import { Result } from '../../interfaces/Result';
import { CabecalhoService } from '../cabecalho/cabecalho.service';

@Injectable({
  providedIn: 'root'
})
export class ContratoservicesService {

  private readonly uri: string = `${environment.apiUrl}Contrato/`;

  constructor(private http: HttpClient, private cabecalhoServicos: CabecalhoService) { }
  
  getContratosAtivos(token: string): Observable<Result<ContratoSelected[]>>{

    let _headers = this.cabecalhoServicos.gerarCabecalho(token);

    return this.http.get<Result<ContratoSelected[]>>(`${this.uri}contratos-ativos`,{ headers: _headers });
  }
}
