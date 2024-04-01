import { Component } from '@angular/core';
import { LoginServicesService } from '../login/login-services.service';
import { Router } from '@angular/router';
import { ProvedormenuService } from '../../provedorMenu/provedormenu.service';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrl: './logout.component.css'
})
export class LogoutComponent {
  constructor(private loginService: LoginServicesService, private router: Router, private menus: ProvedormenuService){
    this.loginService.setUserAuthenticado(false);  
    this.menus.LogoutTransacoes();  
    this.router.navigate(['/login']);
  }
}
