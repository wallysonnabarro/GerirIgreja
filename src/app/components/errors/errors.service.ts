import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { DialogComponent } from '../dialog/dialog.component';
import { HttpErrorResponse } from '@angular/common/http';
import { ValidarTokenService } from '../../services/validar-token.service';
import { catchError, first, of, tap } from 'rxjs';
import { LoginServicesService } from '../login/login-services.service';

@Injectable({
  providedIn: 'root'
})
export class ErrorsService {

  status = 0;

  constructor(private loginServices: LoginServicesService, private dialog: MatDialog, private router: Router, private validarTokenService: ValidarTokenService) { }

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

  Recarregar(navegacao: string, token: string) {
    this.validarTokenService.ValidarToken(token)
      .pipe(
        first(),
        tap(result => {
          if (result === true) {
            this.loginServices.setUserAuthenticado(true);
            this.router.navigate([navegacao]);
          } else {
            this.router.navigate(['/login']);
          }
        }),
        catchError((error: HttpErrorResponse) => {
          this.Errors(error);
          return of(null);
        }))
      .subscribe();
  }

}
