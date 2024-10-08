import { Component, ViewChild } from '@angular/core';
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
import { ListPagamento } from '../../../../interfaces/ListPagamento';
import { FichapagamentosvoluntariosComponent } from '../../fichapagamentosvoluntarios/fichapagamentosvoluntarios.component';
import { ApexAxisChartSeries, ApexChart, ApexNonAxisChartSeries, ApexTitleSubtitle, ChartComponent } from "ng-apexcharts";

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

  //Pagamentos - saida

  dinheiroSaida = 0;
  debitoSaida = 0;
  pixSaida = 0;
  creditoSaida = 0;
  creditoParceladoSaida = 0;
  TotalSaida = 0;

  //Pagamentos - oferta

  dinheiroOferta = 0;
  debitoOferta = 0;
  pixOferta = 0;
  creditoOferta = 0;
  creditoParceladoOferta = 0;
  TotalOferta = 0;

  //Pagamentos - lanchonete

  dinheirolanchonete = 0;
  debitolanchonete = 0;
  pixlanchonete = 0;
  creditolanchonete = 0;
  creditoParceladolanchonete = 0;
  Totallanchonete = 0;

  chartSeries: ApexNonAxisChartSeries = [];
  chartSeriesoferta: ApexNonAxisChartSeries = [];
  chartSeriesolanchonete: ApexNonAxisChartSeries = [];
  chartDetails: ApexChart = {
    type: 'donut',
    toolbar: {
      show: true
    }
  }

  chartLabels = ["Dinheiro", "Débito", "PIX/TED", "Crédito à vista", "Crédito Parcelado"];

  chartTitle: ApexTitleSubtitle = {
    text: 'Pagamentos',
    align: 'left'
  }

  chartTitleOferta: ApexTitleSubtitle = {
    text: 'Ofertas',
    align: 'left'
  }
  
  chartTitlelanchonete: ApexTitleSubtitle = {
    text: 'Lanchonete',
    align: 'left'
  }

  constructor(private fb: FormBuilder, private dialog: MatDialog, private localStoreServices: LocalStorageServiceService,
    private pagamentoServices: PagamentosService, private siaoService: SiaoService, private errorServices: ErrorsService) {
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

          result.dados.forEach(d => {
            if (d.tipo == 1) {
              this.dinheiro = d.dinheiro;
              this.debito = d.debito;
              this.credito = d.credito;
              this.creditoParcelado = d.creditoParcelado;
              this.pix = d.pix;
              this.aReceber = d.receber;
              this.descontar = d.descontar;
              this.total = d.total;
            }

            if(d.tipo == 2){
              this.dinheiroSaida = d.dinheiro;
              this.debitoSaida = d.debito;
              this.pixSaida = d.pix;
              this.creditoSaida = d.credito;
              this.creditoParceladoSaida = d.creditoParcelado;
              this.TotalSaida = d.total;

              this.chartSeries = [
                (this.dinheiroSaida / d.total) * 100,
                (this.debitoSaida / d.total) * 100,
                (this.pixSaida / d.total) * 100,
                (this.creditoSaida / d.total) * 100,
                (this.creditoParceladoSaida / d.total) * 100
              ]
            }

            if (d.tipo == 3) {
              this.dinheiroOferta = d.dinheiro;
              this.debitoOferta = d.debito;
              this.pixOferta = d.pix;
              this.creditoOferta = d.credito;
              this.creditoParceladoOferta = d.creditoParcelado;
              this.TotalOferta = d.total;

              this.chartSeriesoferta = [
                (this.dinheiroOferta / d.total) * 100,
                (this.debitoOferta / d.total) * 100,
                (this.pixOferta / d.total) * 100,
                (this.creditoOferta / d.total) * 100,
                (this.creditoParceladoOferta / d.total) * 100
              ]
            }

            if (d.tipo == 4) {
              this.dinheirolanchonete = d.dinheiro;
              this.debitolanchonete = d.debito;
              this.pixlanchonete = d.pix;
              this.creditolanchonete = d.credito;
              this.creditoParceladolanchonete = d.creditoParcelado;
              this.Totallanchonete = d.total;

              this.chartSeriesolanchonete = [
                (this.dinheirolanchonete / d.total) * 100,
                (this.debitolanchonete / d.total) * 100,
                (this.pixlanchonete / d.total) * 100,
                (this.creditolanchonete / d.total) * 100,
                (this.creditoParceladolanchonete / d.total) * 100
              ]
            }

          });

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
