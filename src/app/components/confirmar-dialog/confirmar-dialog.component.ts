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
import { ErrorsService } from '../errors/errors.service';

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
    , private localStoreServices: LocalStorageServiceService, private router: Router, private pagamentoServices: PagamentosService, private errorServices: ErrorsService,
  ) {

    const toke = this.localStoreServices.GetLocalStorage();

    if (toke !== null) {
      this.token = toke;
    } else {
      this.errorServices.Redirecionar();
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

  OK() {
    const { debito, dinheiro, credito, creditoParcelado, pix, parcelas, receber, decontar, observacao } = this.form.value;

    let novoPagamento: PagamentoConfirmar = {
      credito: this.parseDecimal(credito),
      creditoParcelado: this.parseDecimal(creditoParcelado),
      dataRegistro: new Date(),
      debito: this.parseDecimal(debito),
      descontar: this.parseDecimal(decontar),
      desistente: 0,
      dinheiro: this.parseDecimal(dinheiro),
      fichaConsumidor: this.tipo === 2 ? this.id : 0,
      observacao: observacao,
      parcelas: parcelas,
      pix: this.parseDecimal(pix),
      receber: receber,
      siao: this.siao,
      voluntario: this.tipo === 1 ? this.id : 0
    }

    this.pagamentoServices.novo(novoPagamento, this.token)
      .pipe(
        first(),
        tap(result => {
          this.openDialog("Registrado com sucesso.");
        }),
        catchError((error: HttpErrorResponse) => {
          this.errorServices.Errors(error);
          return of(null);
        })
      )
      .subscribe();
  }

  Fechar(): void {
    this.dialogRef.close({});
  }

  parseDecimal(value: any): number {
    const parsed = parseFloat(value);
    return isNaN(parsed) ? 0 : parsed;
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

}
