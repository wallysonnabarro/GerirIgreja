import { Injectable } from '@angular/core';
import { TokenResult } from './jwtService/token-result';
import { LocalStorageServiceService } from '../storage/local-storage-service.service';
import { TokenInterface } from '../components/login/TokenInterface';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class JwtServiceService {

  private result!: TokenResult;

  constructor(private localStorage: LocalStorageServiceService) { }

  decodeJwt(tokenInterface: TokenInterface): TokenResult {
    try {
      const decodedToken: any = jwtDecode(tokenInterface.toke);
  
      this.result = {
        name: decodedToken['unique_name'],
        role: decodedToken['role'],
        success: true
      };

      this.localStorage.RegistraLocalStorage(tokenInterface);

      return this.result;  
    } catch (error) {      
      return this.result = {
        name: '',
        role: '',
        success: false
      };
    }    
  }

  decodeTokenJwt(token: string){
    const decodedToken: any = jwtDecode(token);

    return decodedToken['role'];
  }

  decodeJwtLogado(): string | null {
    let local = this.localStorage.GetLocalStorage();
    if(local != null){
      const decodedToken: any = jwtDecode(local!);

      return decodedToken['role'];
    }
    return null;
  }

  decodeJwtAutenticacao(): string | null {
    let local = this.localStorage.GetLocalStorage();
        
    return local;
  }
}
