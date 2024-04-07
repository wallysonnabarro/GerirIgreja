import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Result } from '../../interfaces/Result';
import { Observable } from 'rxjs';
import { PagamentoCancelar } from '../../interfaces/PagamentoCancelar';
import { PagamentoConfirmar } from '../../interfaces/PagamentoConfirmar';
import { TransferenciaDto } from '../../interfaces/TransferenciaDto';

@Injectable({
  providedIn: 'root'
})
export class PagamentosService {
 
  private readonly uri: string = `${environment.apiUrl}Pagamentos/`;

  constructor(private http: HttpClient) { }

  novo(pagamento: PagamentoConfirmar, token: string): Observable<Result<boolean>> {

    let _headers: HttpHeaders = new HttpHeaders({
      'accept': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    return this.http.post<Result<boolean>>(`${this.uri}confirmar`, pagamento, { headers: _headers });
  }

  cancelar(token: string, pagamentoCancelar: PagamentoCancelar): Observable<Result<boolean>>{

    let _headers: HttpHeaders = new HttpHeaders({
      'accept': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    return this.http.post<Result<boolean>>(`${this.uri}cancelar`, pagamentoCancelar, { headers: _headers });
  }

  transferir(token: string, trasfer: TransferenciaDto): Observable<Result<boolean>>{

    let _headers: HttpHeaders = new HttpHeaders({
      'accept': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    return this.http.post<Result<boolean>>(`${this.uri}trasnferir`, trasfer, { headers: _headers });
  }

  
  buscarPagamento(token: string, id: number): Observable<Result<boolean>>{

    let _headers: HttpHeaders = new HttpHeaders({
      'accept': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    return this.http.get<Result<boolean>>(`${this.uri}buscar-pagamento/${id}`, { headers: _headers });
  }
}
