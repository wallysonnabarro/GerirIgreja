import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { ItemPagamento } from '../../../../interfaces/ItemPagamento';
import { Observable } from 'rxjs';
import { Result } from '../../../../interfaces/Result';

@Injectable({
  providedIn: 'root'
})
export class SaidasService {
 
  private readonly uri: string = `${environment.apiUrl}Pagamentos/`;

  constructor(private http: HttpClient) { }

  PostSaida(lista: ItemPagamento[], token: string): Observable<Result<string>>{

    let _headers: HttpHeaders = new HttpHeaders({
      'accept': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    return this.http.post<Result<string>>(`${this.uri}registra-lista-saida`, lista, { headers: _headers });
  }
}
