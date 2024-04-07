import { Component } from '@angular/core';
import { ProvedormenuService } from '../../provedorMenu/provedormenu.service';
import { TokenDialogComponent } from '../token-dialog/token-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  ImagemPathLogo: string;
  
  constructor(private menus: ProvedormenuService, private dialog: MatDialog){
    this.ImagemPathLogo = 'assets/img/logo_verde.png';
  }

  isMenuItemVisible(itemName: string): boolean {
    return this.menus.menus.some(menu => menu.nome === itemName && menu.status);
  }

  openModal(id: number){
    this.openDialog("Coloque o token fornecido pelo evento.", id);
  }

  
  openDialog(p: string, id: number): void {
    const dialogRef = this.dialog.open(TokenDialogComponent, {
      data: { titulo: 'Inscrições', paragrafo: p, id: id },
      width: '400px',
    });

    dialogRef.afterClosed().subscribe(result => {
    });
  }

}
