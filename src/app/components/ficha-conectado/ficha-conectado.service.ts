import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FichaConectado } from '../../interfaces/FichaConectados';
import { Observable } from 'rxjs';
import { Result } from '../../interfaces/Result';
import { FichaLider } from '../../interfaces/FichaLider';
import { FichaParametros } from '../../interfaces/FichaParametros';
import { FichaPagamento } from '../pagamentos/FichaPagamento';

@Injectable({
  providedIn: 'root'
})
export class FichaConectadoService {

  private readonly uri: string = `${environment.apiUrl}Ficha/`;

  constructor(private http: HttpClient) { }

  postFichaConectado(ficha: FichaConectado): Observable<Result<boolean>> {

    let _headers: HttpHeaders = new HttpHeaders({
      'accept': 'application/json',
    });

    return this.http.post<Result<boolean>>(`${this.uri}novo-conectado`, ficha, { headers: _headers });
  }

  postFichaLider(ficha: FichaLider): Observable<Result<boolean>> {

    let _headers: HttpHeaders = new HttpHeaders({
      'accept': 'application/json'
    });

    return this.http.post<Result<boolean>>(`${this.uri}novo-lider`, ficha, { headers: _headers });
  }
  
  lista(ficha: FichaParametros, token: string): Observable<Result<FichaPagamento>> {

    let _headers: HttpHeaders = new HttpHeaders({
      'accept': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    return this.http.post<Result<FichaPagamento>>(`${this.uri}lista-inscricoes`, ficha, { headers: _headers });
  }
}
