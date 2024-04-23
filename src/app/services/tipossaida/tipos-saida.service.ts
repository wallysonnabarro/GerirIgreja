import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Tipo } from '../../interfaces/Tipo';
import { Observable } from 'rxjs';
import { Result } from '../../interfaces/Result';
import { Pages } from '../../interfaces/pages';

@Injectable({
  providedIn: 'root'
})
export class TiposSaidaService {

  private readonly uri: string = `${environment.apiUrl}TiposSaidas/`;

  constructor(private http: HttpClient) { }

  Lista(page: number, token: string): Observable<Result<Pages<Tipo[]>>> {
    const wrapper = {
      Skip: page,
      PageSize: 10
    };

    let _headers: HttpHeaders = new HttpHeaders({
      'accept': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    return this.http.post<Result<Pages<Tipo[]>>>(`${this.uri}listar`, wrapper, { headers: _headers });
  }


  ListaTodos(token: string): Observable<Result<Tipo[]>> {

    let _headers: HttpHeaders = new HttpHeaders({
      'accept': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    return this.http.get<Result<Tipo[]>>(`${this.uri}listar-todos`, { headers: _headers });
  }

  novo(tipo: string, token: string): Observable<Result<string>> {
    let _headers: HttpHeaders = new HttpHeaders({
      'accept': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    return this.http.get<Result<string>>(`${this.uri}novo/${tipo}`, { headers: _headers });
  }

  detalhar(id: number, token: string): Observable<Result<Tipo>> {
    let _headers: HttpHeaders = new HttpHeaders({
      'accept': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    return this.http.get<Result<Tipo>>(`${this.uri}detalhar/${id}`, { headers: _headers });
  }

  editar(tipo: Tipo, token: string): Observable<Result<string>> {
    let _headers: HttpHeaders = new HttpHeaders({
      'accept': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    return this.http.post<Result<string>>(`${this.uri}editar`, tipo, { headers: _headers });
  }
}
