import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ValidarTokenService {


  private readonly uri: string = `${environment.apiUrl}Usuario/`;

  constructor(private http: HttpClient) { }
  
  ValidarToken(token: string): Observable<boolean>{

    let _headers: HttpHeaders = new HttpHeaders({
      'accept': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    return this.http.get<boolean>(`${this.uri}validar-token`,{ headers: _headers });
  }
}
