import { Component } from '@angular/core';
import { Eventos } from '../../../interfaces/Eventos';
import { selector } from '../../../interfaces/seletor';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { LocalStorageServiceService } from '../../../storage/local-storage-service.service';
import { SiaoService } from '../../siao/siao.service';
import { PagamentosService } from '../pagamentos.service';
import { ErrorsService } from '../../errors/errors.service';
import { formaPagamento } from '../../../enums/formaPagamento';
import { catchError, first, of, tap } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { DialogComponent } from '../../dialog/dialog.component';
import { Lanchonete } from './Lanchonete';

@Component({
  selector: 'app-lanchonete',
  templateUrl: './lanchonete.component.html',
  styleUrl: './lanchonete.component.css'
})
export class LanchoneteComponent {

  eventos: Eventos[] = [];
  lista: Lanchonete[] = []; 
  formas: selector[] = [
    { id: formaPagamento.dinheiro, nome: 'Dinheiro' },
    { id: formaPagamento.debito, nome: 'Débito' },
    { id: formaPagamento.credito, nome: 'Crédito' },
    { id: formaPagamento.creditoParcela, nome: 'Crédito Parcelado' },
    { id: formaPagamento.pix, nome: 'PIX' },
  ];
  form: FormGroup;
  token = "";
  evento = 0;
  forma = 0;

  constructor(private fb: FormBuilder, private dialog: MatDialog, private localStoreServices: LocalStorageServiceService,
    private pagamentoServices: PagamentosService, private siaoService: SiaoService,
    private errorServices: ErrorsService) {
    this.form = this.fb.group({
      valor: [0, [Validators.required]],
      evento: [0, [Validators.required]],
      forma: [0, [Validators.required]],
      descricao: ['', [Validators.required]]
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
    this.evento = evento;
  }

  formaSelecionado() {
    const { forma } = this.form.value;
    this.forma = forma;
  }

  openDialog(p: string): void {
    const dialogRef = this.dialog.open(DialogComponent, {
      data: { titulo: 'Pagamentos', paragrafo: p },
      width: '350px',
    });

    dialogRef.afterClosed().subscribe(result => {
    });
  }

  adicionar() {
    if (this.form.valid) {
      const { valor, descricao } = this.form.value;

      const formaSelecionada = this.formas.find(forma => forma.id === this.forma);

      const item: Lanchonete = {
        Forma: formaSelecionada ? formaSelecionada.nome : '',
        Valor: valor,
        Descricao: descricao
      };

      this.lista.push(item);

      this.form.reset({
        valor: 0,
        forma: 0,
        descricao: ''
      });

    }
    else {
      this.openDialog("Preencha os campos obrigatórios.");
    }
  }

  finalizar() {
    if (this.lista.length > 0) {

      this.pagamentoServices.PostEntradaLanchonete(this.lista, this.token, this.evento)
        .pipe(
          first(),
          tap(result => {
            this.openDialog("Registrado com sucesso.");
            this.lista = [];
          }),
          catchError((error: HttpErrorResponse) => {
            this.errorServices.Errors(error);
            return of(null);
          })
        )
        .subscribe();
    } else {
      this.openDialog("A lista vázia.");
    }
  }

}
