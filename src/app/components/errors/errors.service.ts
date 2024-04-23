import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { DialogComponent } from '../dialog/dialog.component';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ErrorsService {

  status = 0;

  constructor(private dialog: MatDialog, private router: Router) { }

  Errors(error: HttpErrorResponse) {
    let errorMessage = "";

    if (error.status === 403) {
      errorMessage = error.error.mensagem;
    } else if (error.status === 401) {
      errorMessage = error.error.mensagem;
    } else if (error.status === 500) {
      errorMessage = error.error.mensagem;
    } else if (error.status === 0) {
      errorMessage = 'Erro de conexão: O servidor não está ativo ou não responde.';
    } else {
      errorMessage = error.error.mensagem;
    }

    this.status = error.status;
    this.openDialog(errorMessage);
  }

  openDialog(p: string): void {
    const dialogRef = this.dialog.open(DialogComponent, {
      data: { titulo: 'Pagamentos', paragrafo: p },
      width: '350px',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (this.status === 403 || this.status === 401) {
        this.Redirecionar();
      }
    });
  }

  Redirecionar() {
    this.router.navigate(['/login']);
  }
}
