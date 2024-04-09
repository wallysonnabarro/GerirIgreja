import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { LocalStorageServiceService } from '../../storage/local-storage-service.service';
import { DialogConfirmacao } from '../confirmar-dialog/DialogConfirmacao';
import { PagamentosService } from '../pagamentos/pagamentos.service';
import { DialogComponent } from '../dialog/dialog.component';
import { HttpErrorResponse } from '@angular/common/http';
import { first, tap, catchError, of } from 'rxjs';
import { PagamentoConfirmar } from '../../interfaces/PagamentoConfirmar';
import { PagamentoCancelar } from '../../interfaces/PagamentoCancelar';
import { PagamentoAtualizar } from '../../interfaces/PagamentoAtualizar';

@Component({
  selector: 'app-atualizar-dialog',
  templateUrl: './atualizar-dialog.component.html',
  styleUrl: './atualizar-dialog.component.css'
})
export class AtualizarDialogComponent {

  form: FormGroup;
  id = 0;
  siao = 0;
  tipo = 0;
  token = "";
  idPagamento = 0;

  constructor(
    public dialogRef: MatDialogRef<AtualizarDialogComponent>,
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

    const getAtualizar: PagamentoCancelar = {
      id: this.id,
      siao: this.siao,
      tipo: this.tipo
    }

    this.pagamentoServices.buscarPagamento(this.token, getAtualizar)
      .pipe(
        first(),
        tap(result => {
          if (result.succeeded) {
            this.form = this.fb.group({
              debito: [result.dados.debito],
              dinheiro: [result.dados.dinheiro],
              credito: [result.dados.credito],
              creditoParcelado: [result.dados.creditoParcelado],
              pix: [result.dados.pix],
              parcelas: [result.dados.parcelas],
              receber: [result.dados.receber],
              decontar: [result.dados.descontar],
              observacao: [result.dados.observacao],
            });
            this.idPagamento = result.dados.idPagamento;
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

  private Redirecionar() {
    this.router.navigate(['/login']);
  }

  OK() {
    const { debito, dinheiro, credito, creditoParcelado, pix, parcelas, receber, decontar, observacao } = this.form.value;

    let atualizarPagamento: PagamentoAtualizar = {
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
      voluntario: this.tipo === 1 ? this.id : 0,
      idPagamento: this.idPagamento
    }

    this.pagamentoServices.atualizar(this.token, atualizarPagamento)
      .pipe(
        first(),
        tap(result => {
          if (result.succeeded) {
            this.openDialog("Atualizado com sucesso.");
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
      data: { titulo: 'Confirmar', paragrafo: p },
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
