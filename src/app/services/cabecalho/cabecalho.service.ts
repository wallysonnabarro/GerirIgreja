import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CabecalhoService {

  private readonly key: string = `${environment.keyApi}`;
  
  constructor() { }

  gerarCabecalho(token: string): HttpHeaders {  
    let headers: HttpHeaders;

    if (token === "") {
      headers = new HttpHeaders({
        'accept': 'application/json',
        'Ocp-Apim-Subscription-Key': this.key
      });
    } else {
      headers = new HttpHeaders({
        'accept': 'application/json',
        'Authorization': `Bearer ${token}`,
        'Ocp-Apim-Subscription-Key': this.key
      });
    }

    return headers;
  }
}
