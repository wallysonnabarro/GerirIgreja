import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { LoginServicesService } from "../components/login/login-services.service";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
  })
  export class AuthGuardCanActivate implements CanActivate {
    constructor(private loginServicesService: LoginServicesService, private router: Router){}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): 
    boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
        if(this.loginServicesService.UserIsAuthentication()){
            return true;
        }else {
            this.router.navigate(['/login']);
    
            return false;
        }
    }
  }