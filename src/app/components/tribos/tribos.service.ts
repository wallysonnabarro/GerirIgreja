import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Tribos } from './tribos';
import { Pages } from '../../interfaces/pages';
import { Result } from '../../interfaces/Result';
import { TriboNovo } from '../../interfaces/TriboNovo';

@Injectable({
  providedIn: 'root'
})
export class TribosService {

  private readonly uri: string = `${environment.apiUrl}Tribos/`;

  constructor(private http: HttpClient) { }

  Lista(page: number, token: string): Observable<Result<Pages<Tribos[]>>> {
    const wrapper = {
      Skip: page,
      PageSize: 10
    };

    let _headers: HttpHeaders = new HttpHeaders({
      'accept': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    return this.http.post<Result<Pages<Tribos[]>>>(`${this.uri}getAll`, wrapper, { headers: _headers });
  }

  Novo(TriboNovo: TriboNovo, token: string): Observable<Result<Tribos>> {

    let _headers: HttpHeaders = new HttpHeaders({
      'accept': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    return this.http.post<Result<Tribos>>(`${this.uri}novo`, TriboNovo, { headers: _headers });
  }

  Detalhar(id: number, token: string): Observable<Result<Tribos>> {
    
    let _headers: HttpHeaders = new HttpHeaders({
      'accept': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    return this.http.post<Result<Tribos>>(`${this.uri}detalhar/${id}`, null, { headers: _headers });
  }

  Editar(tribo: Tribos, token: string): Observable<Result<Tribos>> {

    let _headers: HttpHeaders = new HttpHeaders({
      'accept': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    return this.http.post<Result<Tribos>>(`${this.uri}editar`, tribo, { headers: _headers });
  }
}
