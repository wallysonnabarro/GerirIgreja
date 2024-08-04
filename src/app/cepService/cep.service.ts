import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Cep } from '../interfaces/Cep';
import { environment } from '../../environments/environment';
import { CabecalhoService } from '../services/cabecalho/cabecalho.service';
import { CepDto } from './CepDto';

@Injectable({
  providedIn: 'root'
})
export class CepService {
  
  private readonly uri: string = `${environment.apiUrl}Cep/`;

  constructor(private http: HttpClient, private cabecalhoServicos: CabecalhoService) { }

  getCep(cep: string): Observable<Cep> {

    let _headers = this.cabecalhoServicos.gerarCabecalho('');

    const Cep: CepDto = {
      Cep: cep
    };
    
    return this.http.post<Cep>(`${this.uri}cep`, Cep, { headers: _headers });
  }

}
