import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Eventos } from '../../../../interfaces/Eventos';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { LocalStorageServiceService } from '../../../../storage/local-storage-service.service';
import { PagamentosService } from '../../pagamentos.service';
import { DialogComponent } from '../../../dialog/dialog.component';
import { HttpErrorResponse } from '@angular/common/http';
import { first, tap, catchError, of } from 'rxjs';
import { SiaoService } from '../../../siao/siao.service';
import { ErrorsService } from '../../../errors/errors.service';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { ListPagamento } from '../../../../interfaces/ListPagamento';
import { FichapagamentosvoluntariosComponent } from '../../fichapagamentosvoluntarios/fichapagamentosvoluntarios.component';


@Component({
  selector: 'app-fechamento-geral',
  templateUrl: './fechamento-geral.component.html',
  styleUrl: './fechamento-geral.component.css'
})
export class FechamentoGeralComponent {

  eventos: Eventos[] = [];
  listPagamento: ListPagamento[] = [];
  form: FormGroup;
  token = "";
  dinheiro = 0;
  debito = 0;
  credito = 0;
  creditoParcelado = 0;
  pix = 0;
  aReceber = 0;
  descontar = 0;
  total = 0;
  eventoSelect = false;


  constructor(private fb: FormBuilder, private dialog: MatDialog, private localStoreServices: LocalStorageServiceService,
    private router: Router, private pagamentoServices: PagamentosService, private siaoService: SiaoService,
    private errorServices: ErrorsService) {
    this.form = this.fb.group({
      evento: [0, [Validators.required]]
    });

    const toke = this.localStoreServices.GetLocalStorage();

    if (toke !== null) {
      this.token = toke;
    } else {
      this.errorServices.Redirecionar();
    }
    this.siaoService.getSiaoIniciado(this.token)
      .pipe(
        first(),
        tap(result => {
          this.eventos = result.dados;
        }),
        catchError((error: HttpErrorResponse) => {
          this.errorServices.Errors(error);
          return of(null);
        }))
      .subscribe();

  }

  eventoSelecionado() {
    const { evento } = this.form.value;

    this.pagamentoServices.buscarPagamentos(this.token, evento)
      .pipe(
        first(),
        tap(result => {
          this.dinheiro = result.dados.dinheiro;
          this.debito = result.dados.debito;
          this.credito = result.dados.credito;
          this.creditoParcelado = result.dados.creditoParcelado;
          this.pix = result.dados.pix;
          this.aReceber = result.dados.receber;
          this.descontar = result.dados.descontar;
          this.total = result.dados.total;

          this.eventoSelect = true;
        }),
        catchError((error: HttpErrorResponse) => {
          this.errorServices.Errors(error);
          return of(null);
        }))
      .subscribe();
  }

  openDialog(p: string): void {
    const dialogRef = this.dialog.open(DialogComponent, {
      data: { titulo: 'Pagamentos', paragrafo: p },
      width: '350px',
    });

    dialogRef.afterClosed().subscribe(result => {
    });
  }

  PagamentosConectados() {
    const { evento } = this.form.value;
    
    var tituloRelatorio = "FICHA DE PAGAMENTOS CONECTADOS"

    this.pagamentoServices.buscarPagamentosExcelConectados(this.token, evento)
      .pipe(
        first(),
        tap(result => {
          this.listPagamento = result;

          const dialogRef = this.dialog.open(FichapagamentosvoluntariosComponent, {
            data: {
              titulo: tituloRelatorio, paragrafo: "Ficha conectados."
              , Lista: this.listPagamento
            },
            width: '840px',
          });

          dialogRef.afterClosed().subscribe(result => { });
        }),
        catchError((error: HttpErrorResponse) => {
          this.errorServices.Errors(error);
          return of(null);
        }))
      .subscribe();
  }

  PagamentosVoluntarios() {
    const { evento } = this.form.value;
    
    var tituloRelatorio = "FICHA DE PAGAMENTOS VOLUNTÁRIOS"

    this.pagamentoServices.buscarPagamentosExcelVoluntarios(this.token, evento)
      .pipe(
        first(),
        tap(result => {
          this.listPagamento = result;

          const dialogRef = this.dialog.open(FichapagamentosvoluntariosComponent, {
            data: {
              titulo: tituloRelatorio, paragrafo: "Ficha voluntários."
              , Lista: this.listPagamento
            },
            width: '840px',
          });

          dialogRef.afterClosed().subscribe(result => { });
        }),
        catchError((error: HttpErrorResponse) => {
          this.errorServices.Errors(error);
          return of(null);
        }))
      .subscribe();
  }
}
