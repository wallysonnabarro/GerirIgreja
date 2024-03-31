import { Component } from '@angular/core';
import { ProvedormenuService } from '../../provedorMenu/provedormenu.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  ImagemPathLogo: string;
  
  constructor(private menus: ProvedormenuService){
    this.ImagemPathLogo = 'assets/img/logo_verde.png';
  }

  isMenuItemVisible(itemName: string): boolean {
    return this.menus.menus.some(menu => menu.nome === itemName && menu.status);
  }
}
