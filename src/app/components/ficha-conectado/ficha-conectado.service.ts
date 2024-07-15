import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FichaConectado } from '../../interfaces/FichaConectados';
import { Observable } from 'rxjs';
import { Result } from '../../interfaces/Result';
import { FichaLider } from '../../interfaces/FichaLider';
import { FichaParametros } from '../../interfaces/FichaParametros';
import { FichaPagamento } from '../pagamentos/FichaPagamento';
import { CabecalhoService } from '../../services/cabecalho/cabecalho.service';

@Injectable({
  providedIn: 'root'
})
export class FichaConectadoService {

  private readonly uri: string = `${environment.apiUrl}Ficha/`;

  constructor(private http: HttpClient, private cabecalhoServicos: CabecalhoService) { }

  postFichaConectado(ficha: FichaConectado): Observable<Result<boolean>> {

    let _headers = this.cabecalhoServicos.gerarCabecalho('');

    return this.http.post<Result<boolean>>(`${this.uri}novo-conectado`, ficha, { headers: _headers });
  }

  postFichaLider(ficha: FichaLider): Observable<Result<boolean>> {

    let _headers = this.cabecalhoServicos.gerarCabecalho('');

    return this.http.post<Result<boolean>>(`${this.uri}novo-lider`, ficha, { headers: _headers });
  }
  
  lista(ficha: FichaParametros, token: string): Observable<Result<FichaPagamento>> {

    let _headers = this.cabecalhoServicos.gerarCabecalho(token);

    return this.http.post<Result<FichaPagamento>>(`${this.uri}lista-inscricoes`, ficha, { headers: _headers });
  }

  listaNaoConfirmados(ficha: FichaParametros, token: string): Observable<Result<FichaPagamento>> {

    let _headers = this.cabecalhoServicos.gerarCabecalho(token);

    return this.http.post<Result<FichaPagamento>>(`${this.uri}lista-inscricoes-nao-confirmados`, ficha, { headers: _headers });
  }
}
