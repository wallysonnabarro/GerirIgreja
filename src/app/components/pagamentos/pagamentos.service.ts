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
import { ListPagamento } from '../../interfaces/ListPagamento';
import { Oferta } from './oferta/Oferta';

@Injectable({
  providedIn: 'root'
})
export class PagamentosService {

  private readonly uri: string = `${environment.apiUrl}Pagamentos/`;

  constructor(private http: HttpClient) { }

  novo(pagamento: PagamentoConfirmar, token: string): Observable<Result<boolean>> {

    let _headers: HttpHeaders = new HttpHeaders({
      'accept': 'application/json',
      'Authorization': `Bearer ${token}`,
      'Ocp-Apim-Subscription-Key': '1355424734c44ad2a6fca62712240920'
    });

    return this.http.post<Result<boolean>>(`${this.uri}confirmar`, pagamento, { headers: _headers });
  }

  cancelar(token: string, pagamentoCancelar: PagamentoCancelar): Observable<Result<boolean>> {

    let _headers: HttpHeaders = new HttpHeaders({
      'accept': 'application/json',
      'Authorization': `Bearer ${token}`,
      'Ocp-Apim-Subscription-Key': '1355424734c44ad2a6fca62712240920'
    });

    return this.http.post<Result<boolean>>(`${this.uri}cancelar`, pagamentoCancelar, { headers: _headers });
  }

  transferir(token: string, trasfer: TransferenciaDto): Observable<Result<boolean>> {

    let _headers: HttpHeaders = new HttpHeaders({
      'accept': 'application/json',
      'Authorization': `Bearer ${token}`,
      'Ocp-Apim-Subscription-Key': '1355424734c44ad2a6fca62712240920'
    });

    return this.http.post<Result<boolean>>(`${this.uri}trasnferir`, trasfer, { headers: _headers });
  }


  buscarPagamento(token: string, atualizar: PagamentoCancelar): Observable<Result<PagamentoAtualizar>> {

    let _headers: HttpHeaders = new HttpHeaders({
      'accept': 'application/json',
      'Authorization': `Bearer ${token}`,
      'Ocp-Apim-Subscription-Key': '1355424734c44ad2a6fca62712240920'
    });

    return this.http.post<Result<PagamentoAtualizar>>(`${this.uri}buscar-pagamento`, atualizar, { headers: _headers });
  }

  atualizar(token: string, atualizar: PagamentoAtualizar): Observable<Result<boolean>> {

    let _headers: HttpHeaders = new HttpHeaders({
      'accept': 'application/json',
      'Authorization': `Bearer ${token}`,
      'Ocp-Apim-Subscription-Key': '1355424734c44ad2a6fca62712240920'
    });

    return this.http.post<Result<boolean>>(`${this.uri}atualizar-pagamento`, atualizar, { headers: _headers });
  }

  buscarPagamentos(token: string, id: number): Observable<Result<Pagamentos[]>> {
    let _headers: HttpHeaders = new HttpHeaders({
      'accept': 'application/json',
      'Authorization': `Bearer ${token}`,
      'Ocp-Apim-Subscription-Key': '1355424734c44ad2a6fca62712240920'
    });

    return this.http.get<Result<Pagamentos[]>>(`${this.uri}buscar-pagamentos/${id}`, { headers: _headers });
  }

  buscarPagamentosExcelVoluntarios(token: string, id: number): Observable<ListPagamento[]> {
    let _headers: HttpHeaders = new HttpHeaders({
      'accept': 'application/json',
      'Authorization': `Bearer ${token}`,
      'Ocp-Apim-Subscription-Key': '1355424734c44ad2a6fca62712240920'
    });

    return this.http.get<ListPagamento[]>(`${this.uri}pagamentos-voluntarios-excel/${id}`, { headers: _headers });
  }

  buscarPagamentosExcelConectados(token: string, id: number): Observable<ListPagamento[]> {
    let _headers: HttpHeaders = new HttpHeaders({
      'accept': 'application/json',
      'Authorization': `Bearer ${token}`,
      'Ocp-Apim-Subscription-Key': '1355424734c44ad2a6fca62712240920'
    });

    return this.http.get<ListPagamento[]>(`${this.uri}pagamentos-conectados-excel/${id}`, { headers: _headers });
  }

  PostEntradaOfertas(lista: Oferta[], token: string, id: number): Observable<Result<string>> {

    let _headers: HttpHeaders = new HttpHeaders({
      'accept': 'application/json',
      'Authorization': `Bearer ${token}`,
      'Ocp-Apim-Subscription-Key': '1355424734c44ad2a6fca62712240920'
    });

    return this.http.post<Result<string>>(`${this.uri}registra-lista-oferta/${id}`, lista, { headers: _headers });
  }

  
  PostEntradaLanchonete(lista: Oferta[], token: string, id: number): Observable<Result<string>> {

    let _headers: HttpHeaders = new HttpHeaders({
      'accept': 'application/json',
      'Authorization': `Bearer ${token}`,
      'Ocp-Apim-Subscription-Key': '1355424734c44ad2a6fca62712240920'
    });

    return this.http.post<Result<string>>(`${this.uri}registra-lista-lanchonete/${id}`, lista, { headers: _headers });
  }
}
