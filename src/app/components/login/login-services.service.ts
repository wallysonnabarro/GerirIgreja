import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TokenInterface } from './TokenInterface';
import { Result } from '../../interfaces/Result';
import { Login } from './login';
import { CabecalhoService } from '../../services/cabecalho/cabecalho.service';

@Injectable({
  providedIn: 'root'
})
export class LoginServicesService {
 
  private usuarioAutenticado: boolean = false;
  private authKey = 'isAuthenticated';
  private readonly uri: string = `${environment.apiUrl}Usuario/`;
  private isAuthenticated: boolean = false;

  constructor(private http: HttpClient, private cabecalhoServicos: CabecalhoService) {
    this.isAuthenticated = !!localStorage.getItem('authToken');
   }

  UserIsAuthentication(){
    return this.isAuthenticated;
  }
  
  setUserAuthenticado(status: boolean){    
    localStorage.setItem('authToken', "token");
    this.isAuthenticated = true;
  }

  Logar(login: object): Observable<TokenInterface>{

    let _headers = this.cabecalhoServicos.gerarCabecalho('');

    return this.http.post<TokenInterface>(`${this.uri}login`, login,  { headers: _headers });
  } 

  RedefinirSenha(login: Login): Observable<Result<boolean>>{    

    let _headers = this.cabecalhoServicos.gerarCabecalho('');

    return this.http.post<Result<boolean>>(`${this.uri}redefinir-senha`, login,  { headers: _headers });
  }
}
