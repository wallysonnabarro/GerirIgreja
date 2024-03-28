import { Component, ViewChild } from '@angular/core';
import { MatMenu } from '@angular/material/menu';

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
