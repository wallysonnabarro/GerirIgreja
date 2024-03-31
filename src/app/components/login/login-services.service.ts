import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TokenInterface } from './TokenInterface';

@Injectable({
  providedIn: 'root'
})
export class LoginServicesService {

  private usuarioAutenticado: boolean = false;
  private readonly uri: string = `${environment.apiUrl}Usuario/`;

  constructor(private http: HttpClient) { }

  UserIsAuthentication(){
    return this.usuarioAutenticado;
  }
  
  setUserAuthenticado(status: boolean){
    this.usuarioAutenticado = status;
    return this.usuarioAutenticado;
  }

  Logar(login: object): Observable<TokenInterface>{
    
    let _headers: HttpHeaders = new HttpHeaders({
      'accept': 'application/json'
    });

    return this.http.post<TokenInterface>(`${this.uri}login`, login,  { headers: _headers });
  }
 
}
