import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Result } from '../../interfaces/Result';
import { Observable } from 'rxjs';
import { PagamentoCancelar } from '../../interfaces/PagamentoCancelar';
import { PagamentoConfirmar } from '../../interfaces/PagamentoConfirmar';
import { TransferenciaDto } from '../../interfaces/TransferenciaDto';
import { PagamentoAtualizar } from '../../interfaces/PagamentoAtualizar';
import { Pagamentos } from '../../interfaces/Pagamentos';

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

  cancelar(token: string, pagamentoCancelar: PagamentoCancelar): Observable<Result<boolean>> {

    let _headers: HttpHeaders = new HttpHeaders({
      'accept': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    return this.http.post<Result<boolean>>(`${this.uri}cancelar`, pagamentoCancelar, { headers: _headers });
  }

  transferir(token: string, trasfer: TransferenciaDto): Observable<Result<boolean>> {

    let _headers: HttpHeaders = new HttpHeaders({
      'accept': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    return this.http.post<Result<boolean>>(`${this.uri}trasnferir`, trasfer, { headers: _headers });
  }


  buscarPagamento(token: string, atualizar: PagamentoCancelar): Observable<Result<PagamentoAtualizar>> {

    let _headers: HttpHeaders = new HttpHeaders({
      'accept': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    return this.http.post<Result<PagamentoAtualizar>>(`${this.uri}buscar-pagamento`, atualizar, { headers: _headers });
  }

  atualizar(token: string, atualizar: PagamentoAtualizar): Observable<Result<boolean>> {

    let _headers: HttpHeaders = new HttpHeaders({
      'accept': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    return this.http.post<Result<boolean>>(`${this.uri}atualizar-pagamento`, atualizar, { headers: _headers });
  }

  buscarPagamentos(token: string, id: number): Observable<Result<Pagamentos>> {
    let _headers: HttpHeaders = new HttpHeaders({
      'accept': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    return this.http.get<Result<Pagamentos>>(`${this.uri}buscar-pagamentos/${id}`, { headers: _headers });
  }
}
