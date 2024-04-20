import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { DialogEventoComponent } from '../dialog-evento/dialog-evento.component';
import { TokenDialog } from './tokenDialog';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DialogComponent } from '../dialog/dialog.component';
import { TokenDialogService } from './token-dialog.service';
import { TokenConfirmar } from './TokenConfirmar';
import { catchError, first, of, tap } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-token-dialog',
  templateUrl: './token-dialog.component.html',
  styleUrl: './token-dialog.component.css'
})
export class TokenDialogComponent {

  id = 0;
  form: FormGroup;

  constructor(public dialogRef: MatDialogRef<DialogEventoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: TokenDialog, private dialog: MatDialog,
    private router: Router, private fb: FormBuilder, private tokenDialogService: TokenDialogService) {

    this.id = data.id;
    this.form = this.fb.group({
      token: ['', [Validators.required]]
    });
  }

  Fechar(): void {
    this.dialogRef.close({});
  }

  confirmar() {
    if (this.form.valid) {
      const { token } = this.form.value;

      const tokenConfirma: TokenConfirmar = {
        token: token
      }

      this.tokenDialogService.PostToken(tokenConfirma)
        .pipe(
          first(),
          tap(result => {
            if (result.succeeded) {
              if (this.id === 1) {
                const evento = result.dados;
                this.router.navigate(['/conectado'], { state: { evento, token } });
                this.Fechar();
              } else {
                const evento = result.dados;
                this.router.navigate(['/voluntario'], { state: { evento, token } });
                this.Fechar();
              }
            } else {
              this.openDialog(result.errors[0].mensagem);
            }
          }),
          catchError((error: HttpErrorResponse) => {
            this.Errors(error.status);
            this.form.reset();
            return of(null);
          })
        )
        .subscribe();
    } else {
      this.openDialog("É necessário inserir o token do evento.");
    }
  }

  private Errors(status: number) {
    let errorMessage = "";

    if (status === 403) {
      errorMessage = 'Acesso negado.';
    } else if (status === 401) {
      errorMessage = 'Não autorizado.';
    } else if (status === 500) {
      errorMessage = 'Erro interno do servidor.';
    } else if (status === 0) {
      errorMessage = 'Erro de conexão: O servidor não está ativo ou não responde.';
    } else {
      errorMessage = 'Erro de conexão: O servidor recusou a conexão.';
    }

    this.openDialog(errorMessage);
  }

  openDialog(p: string): void {
    const dialogRef = this.dialog.open(DialogComponent, {
      data: { titulo: 'Inscricão', paragrafo: p },
      width: '350px',
    });

    dialogRef.afterClosed().subscribe(result => {
    });
  }
}
