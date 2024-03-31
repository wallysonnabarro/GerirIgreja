import { Injectable } from '@angular/core';
import { TokenInterface } from '../components/login/TokenInterface';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageServiceService {

  constructor() { }

  RegistraLocalStorage(tokenInterface: TokenInterface){
    localStorage.setItem('tokenStorage', tokenInterface.toke);
  }

  GetLocalStorage(){
    return localStorage.getItem('tokenStorage');
  }

  DeleteLocalStorage(){
    localStorage.clear();
  }
}
