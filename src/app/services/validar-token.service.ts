import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { CabecalhoService } from './cabecalho/cabecalho.service';

@Injectable({
  providedIn: 'root'
})
export class ValidarTokenService {


  private readonly uri: string = `${environment.apiUrl}Usuario/`;

  constructor(private http: HttpClient, private cabecalhoServicos: CabecalhoService) { }
  
  ValidarToken(token: string): Observable<boolean>{
       
    let _headers = this.cabecalhoServicos.gerarCabecalho(token);

    return this.http.get<boolean>(`${this.uri}validar-token`,{ headers: _headers });
  }
}
