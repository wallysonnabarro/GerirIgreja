import { Component, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { DialogEventoComponent } from '../dialog-evento/dialog-evento.component';
import { DialogComponent } from '../dialog/dialog.component';
import { DialogConfirmacao } from './DialogConfirmacao';
import { LocalStorageServiceService } from '../../storage/local-storage-service.service';
import { Router } from '@angular/router';
import { PagamentosService } from '../pagamentos/pagamentos.service';
import { PagamentoConfirmar } from '../../interfaces/PagamentoConfirmar';
import { catchError, first, of, tap } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-confirmar-dialog',
  templateUrl: './confirmar-dialog.component.html',
  styleUrl: './confirmar-dialog.component.css'
})
export class ConfirmarDialogComponent {
  form: FormGroup;
  id = 0;
  siao = 0;
  tipo = 0;
  token = "";

  constructor(
    public dialogRef: MatDialogRef<DialogEventoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogConfirmacao, private fb: FormBuilder, private dialog: MatDialog
    , private localStoreServices: LocalStorageServiceService, private router: Router, private pagamentoServices: PagamentosService
  ) {

    const toke = this.localStoreServices.GetLocalStorage();

    if (toke !== null) {
      this.token = toke;
    } else {
      this.Redirecionar();
    }

    this.id = data.id;
    this.siao = data.siao;
    this.tipo = data.tipo;

    this.form = this.fb.group({
      debito: [0],
      dinheiro: [0],
      credito: [0],
      creditoParcelado: [0],
      pix: [0],
      parcelas: [0],
      receber: [0],
      decontar: [0],
      observacao: [''],
    });
  }

  private Redirecionar() {
    this.router.navigate(['/login']);
  }

  OK() {
    const { debito, dinheiro, credito, creditoParcelado, pix, parcelas, receber, decontar, observacao } = this.form.value;

    let novoPagamento: PagamentoConfirmar = {
      credito: credito,
      creditoParcelado: creditoParcelado,
      dataRegistro: new Date(),
      debito: debito,
      descontar: decontar,
      desistente: 0,
      dinheiro: dinheiro,
      fichaConsumidor: this.tipo === 2 ? this.id : 0,
      observacao: observacao,
      parcelas: parcelas,
      pix: pix,
      receber: receber,
      siao: this.siao,
      voluntario: this.tipo === 1 ? this.id : 0
    }

    this.pagamentoServices.novo(novoPagamento, this.token)
      .pipe(
        first(),
        tap(result => {
          if (result.succeeded) {
            this.openDialog("Registrado com sucesso.");
          } else {
            this.openDialog(result.errors[0].mensagem);
          }
        }),
        catchError((error: HttpErrorResponse) => {
          this.Errors(error.status);
          return of(null);
        })
      )
      .subscribe();
  }

  Fechar(): void {
    this.dialogRef.close({});
  }

  openDialog(p: string): void {
    const dialogRef = this.dialog.open(DialogComponent, {
      data: { titulo: 'Login', paragrafo: p },
      width: '350px',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result.status === true) {
        this.dialogRef.close({});
      }
    });
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
}
