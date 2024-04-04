import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FichaConectado } from '../../interfaces/FichaConectados';
import { Observable } from 'rxjs';
import { Result } from '../../interfaces/Result';
import { FichaLider } from '../../interfaces/FichaLider';

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

  postFichaLider(ficha: FichaLider, token: string): Observable<Result<boolean>> {

    let _headers: HttpHeaders = new HttpHeaders({
      'accept': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    return this.http.post<Result<boolean>>(`${this.uri}novo-lider`, ficha, { headers: _headers });
  }
}
