import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { PostAreas } from '../../interfaces/PostAreas';
import { Result } from '../../interfaces/Result';
import { Observable } from 'rxjs';
import { Pages } from '../../interfaces/pages';
import { Areas } from '../../interfaces/Areas';

@Injectable({
  providedIn: 'root'
})
export class AreasService {


  private readonly uri: string = `${environment.apiUrl}Areas/`;

  constructor(private http: HttpClient) { }


  PostAreas(postAreas: PostAreas, token: string): Observable<Result<boolean>> {

    let _headers: HttpHeaders = new HttpHeaders({
      'accept': 'application/json',
      'Authorization': `Bearer ${token}`,
      'Ocp-Apim-Subscription-Key': '1355424734c44ad2a6fca62712240920'
    });

    return this.http.post<Result<boolean>>(`${this.uri}novo`, postAreas, { headers: _headers });
  }

  Lista(page: number, token: string): Observable<Result<Pages<Areas[]>>> {
    const wrapper = {
      Skip: page,
      PageSize: 10
    };

    let _headers: HttpHeaders = new HttpHeaders({
      'accept': 'application/json',
      'Authorization': `Bearer ${token}`,
      'Ocp-Apim-Subscription-Key': '1355424734c44ad2a6fca62712240920'
    });

    return this.http.post<Result<Pages<Areas[]>>>(`${this.uri}listar`, wrapper, { headers: _headers });
  }

  Detalhar(id: number, token: string): Observable<Result<Areas>> {

    let _headers: HttpHeaders = new HttpHeaders({
      'accept': 'application/json',
      'Authorization': `Bearer ${token}`,
      'Ocp-Apim-Subscription-Key': '1355424734c44ad2a6fca62712240920'
    });

    return this.http.post<Result<Areas>>(`${this.uri}detalhar/${id}`, null, { headers: _headers });
  }

  getAreas(token: string): Observable<Result<Areas[]>> {

    let _headers: HttpHeaders = new HttpHeaders({
      'accept': 'application/json'
    });

    return this.http.get<Result<Areas[]>>(`${this.uri}getAreas/${token}`, { headers: _headers });
  }

  Editar(areas: Areas, token: string): Observable<Result<boolean>> {

    let _headers: HttpHeaders = new HttpHeaders({
      'accept': 'application/json',
      'Authorization': `Bearer ${token}`,
      'Ocp-Apim-Subscription-Key': '1355424734c44ad2a6fca62712240920'
    });

    return this.http.post<Result<boolean>>(`${this.uri}editar`, areas, { headers: _headers });
  }
}
