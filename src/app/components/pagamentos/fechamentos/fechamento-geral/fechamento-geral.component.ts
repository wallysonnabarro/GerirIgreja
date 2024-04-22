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

@Component({
  selector: 'app-fechamento-geral',
  templateUrl: './fechamento-geral.component.html',
  styleUrl: './fechamento-geral.component.css'
})
export class FechamentoGeralComponent {

  eventos: Eventos[] = [];
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


  constructor(private fb: FormBuilder, private dialog: MatDialog, private localStoreServices: LocalStorageServiceService,
    private router: Router, private pagamentoServices: PagamentosService, private siaoService: SiaoService) {
    this.form = this.fb.group({
      evento: [0, [Validators.required]]
    });

    const toke = this.localStoreServices.GetLocalStorage();

    if (toke !== null) {
      this.token = toke;
    } else {
      this.Redirecionar();
    }
    this.siaoService.getSiaoIniciado(this.token)
      .pipe(
        first(),
        tap(result => {
          if (result.dados.length > 0) {
            this.eventos = result.dados;
          } else {
            this.openDialog(result.errors[0].mensagem);
          }
        }),
        catchError((error: HttpErrorResponse) => {
          this.Errors(error.status);
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
          if (result.succeeded) {
            this.dinheiro = result.dados.dinheiro;
            this.debito = result.dados.debito;
            this.credito = result.dados.credito;
            this.creditoParcelado = result.dados.creditoParcelado;
            this.pix = result.dados.pix;
            this.aReceber = result.dados.receber;
            this.descontar = result.dados.descontar;
            this.total = result.dados.total;
          } else {
            this.openDialog(result.errors[0].mensagem);
          }
        }),
        catchError((error: HttpErrorResponse) => {
          this.Errors(error.status);
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

  private Redirecionar() {
    this.router.navigate(['/login']);
  }
}
