import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Cep } from '../interfaces/Cep';

@Injectable({
  providedIn: 'root'
})
export class CepService {

  constructor(private http: HttpClient) { }

  getCep(cep: string): Observable<Cep> {

    const url = `http://viacep.com.br/ws/${cep}/json/`;

    return this.http.get<Cep>(url);
  }

}
