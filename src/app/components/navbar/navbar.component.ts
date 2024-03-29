import { Component } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  ImagemPathLogo: string;
  
  constructor(){
    this.ImagemPathLogo = 'assets/img/logo_verde.png';
  }
}
