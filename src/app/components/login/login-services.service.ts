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
  private authKey = 'isAuthenticated';
  private readonly uri: string = `${environment.apiUrl}Usuario/`;

  constructor(private http: HttpClient) { }

  UserIsAuthentication(){
    const isAuthenticated = localStorage.getItem(this.authKey);
    return isAuthenticated === "true";
  }
  
  setUserAuthenticado(status: boolean){
    this.usuarioAutenticado = status;
    localStorage.setItem(this.authKey, status ? 'true' : 'false');
    return this.usuarioAutenticado;
  }

  Logar(login: object): Observable<TokenInterface>{
    
    let _headers: HttpHeaders = new HttpHeaders({
      'accept': 'application/json'
    });

    return this.http.post<TokenInterface>(`${this.uri}login`, login,  { headers: _headers });
  } 
}
