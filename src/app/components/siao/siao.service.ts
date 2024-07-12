import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { PostSiao } from '../../interfaces/PostSiao';
import { Observable } from 'rxjs';
import { Result } from '../../interfaces/Result';
import { Siaos } from '../../interfaces/Siaos';
import { Pages } from '../../interfaces/pages';
import { Eventos } from '../../interfaces/Eventos';

@Injectable({
  providedIn: 'root'
})
export class SiaoService {

  private readonly uri: string = `${environment.apiUrl}Evento/`;

  constructor(private http: HttpClient) { }

  postSiao(postSiao: PostSiao, token: string): Observable<Result<boolean>>{

    let _headers: HttpHeaders = new HttpHeaders({
      'accept': 'application/json',
      'Authorization': `Bearer ${token}`,
      'Ocp-Apim-Subscription-Key': '1355424734c44ad2a6fca62712240920'
    });

    return this.http.post<Result<boolean>>(`${this.uri}novo`, postSiao, { headers: _headers });
  }
  
  Lista(page: number, token: string): Observable<Result<Pages<Siaos[]>>> {
    const wrapper = {
      Skip: page,
      PageSize: 10
    };

    let _headers: HttpHeaders = new HttpHeaders({
      'accept': 'application/json',
      'Authorization': `Bearer ${token}`,
      'Ocp-Apim-Subscription-Key': '1355424734c44ad2a6fca62712240920'
    });

    return this.http.post<Result<Pages<Siaos[]>>>(`${this.uri}listar`, wrapper, { headers: _headers });
  }

  Detalhar(id: number, token: string): Observable<Result<Siaos>> {
    
    let _headers: HttpHeaders = new HttpHeaders({
      'accept': 'application/json',
      'Authorization': `Bearer ${token}`,
      'Ocp-Apim-Subscription-Key': '1355424734c44ad2a6fca62712240920'
    });

    return this.http.post<Result<Siaos>>(`${this.uri}detalhar/${id}`, null, { headers: _headers });
  }

  Editar(siaos: Siaos, token: string): Observable<Result<boolean>> {

    let _headers: HttpHeaders = new HttpHeaders({
      'accept': 'application/json',
      'Authorization': `Bearer ${token}`,
      'Ocp-Apim-Subscription-Key': '1355424734c44ad2a6fca62712240920'
    });

    return this.http.post<Result<boolean>>(`${this.uri}editar`, siaos, { headers: _headers });
  }

  getSiaoIniciado(token: string): Observable<Result<Eventos[]>>{

    let _headers: HttpHeaders = new HttpHeaders({
      'accept': 'application/json',
      'Authorization': `Bearer ${token}`,
      'Ocp-Apim-Subscription-Key': '1355424734c44ad2a6fca62712240920'
    });

    return this.http.get<Result<Eventos[]>>(`${this.uri}evento-andamento`, { headers: _headers });
  }
}
