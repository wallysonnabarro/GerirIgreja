import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { UsuarioLista } from './UsuarioLista';
import { Observable } from 'rxjs';
import { Result } from '../../interfaces/Result';
import { Pages } from '../../interfaces/pages';
import { UsuarioNovo } from './UsuarioNovo';
import { UsuarioDetalhar } from './UsuarioDetalhar';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {


  private readonly uri: string = `${environment.apiUrl}Usuario/`;

  constructor(private http: HttpClient) { }
  
  Lista(page: number, token: string): Observable<Result<Pages<UsuarioLista[]>>> {
    const wrapper = {
      Skip: page,
      PageSize: 10
    };

    let _headers: HttpHeaders = new HttpHeaders({
      'accept': 'application/json',
      'Authorization': `Bearer ${token}`,
      'Ocp-Apim-Subscription-Key': '1355424734c44ad2a6fca62712240920'
    });

    return this.http.post<Result<Pages<UsuarioLista[]>>>(`${this.uri}lista-paginada-novo`, wrapper, { headers: _headers });
  }

  
  novo(token: string, novo: UsuarioNovo ): Observable<Result<boolean>> {
    let _headers: HttpHeaders = new HttpHeaders({
      'accept': 'application/json',
      'Authorization': `Bearer ${token}`,
      'Ocp-Apim-Subscription-Key': '1355424734c44ad2a6fca62712240920'
    });

    return this.http.post<Result<boolean>>(`${this.uri}novo`, novo, { headers: _headers });
  }

  
  detalhar(token: string, id: number): Observable<Result<UsuarioDetalhar>> {
    let _headers: HttpHeaders = new HttpHeaders({
      'accept': 'application/json',
      'Authorization': `Bearer ${token}`,
      'Ocp-Apim-Subscription-Key': '1355424734c44ad2a6fca62712240920'
    });

    return this.http.get<Result<UsuarioDetalhar>>(`${this.uri}detalhar/${id}`, { headers: _headers });
  }
}
