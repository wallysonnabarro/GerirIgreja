import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Result } from '../../interfaces/Result';
import { Observable } from 'rxjs';
import { TokenConfirmar } from './TokenConfirmar';
import { Eventos } from '../../interfaces/Eventos';
import { CabecalhoService } from '../../services/cabecalho/cabecalho.service';

@Injectable({
  providedIn: 'root'
})
export class TokenDialogService {


  private readonly uri: string = `${environment.apiUrl}Evento/`;

  constructor(private http: HttpClient, private cabecalhoServicos: CabecalhoService) { }

  PostToken(tokenConfirmar: TokenConfirmar): Observable<Result<Eventos>> {

    let _headers = this.cabecalhoServicos.gerarCabecalho('');

    return this.http.post<Result<Eventos>>(`${this.uri}confirmar-token`, tokenConfirmar, { headers: _headers });
  }

}
