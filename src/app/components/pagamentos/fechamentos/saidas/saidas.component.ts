import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { first, tap, catchError, of } from 'rxjs';
import { Eventos } from '../../../../interfaces/Eventos';
import { LocalStorageServiceService } from '../../../../storage/local-storage-service.service';
import { SiaoService } from '../../../siao/siao.service';
import { PagamentosService } from '../../pagamentos.service';
import { DialogComponent } from '../../../dialog/dialog.component';
import { selector } from '../../../../interfaces/seletor';
import { formaPagamento } from '../../../../enums/formaPagamento';
import { ItemPagamento } from '../../../../interfaces/ItemPagamento';
import { ErrorsService } from '../../../errors/errors.service';

@Component({
  selector: 'app-saidas',
  templateUrl: './saidas.component.html',
  styleUrl: './saidas.component.css'
})
export class SaidasComponent {

  eventos: Eventos[] = [];
  lista: ItemPagamento[] = [];
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
    private router: Router, private pagamentoServices: PagamentosService, private siaoService: SiaoService, 
    private errorServices: ErrorsService) {
    this.form = this.fb.group({
      valor: [0, [Validators.required]],
      evento: [0, [Validators.required]],
      descricao: ['', [Validators.required]],
      forma: [0, [Validators.required]],
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
      const { descricao, valor, forma } = this.form.value;

      const formaSelecionada = this.formas.find(forma => forma.id === this.forma);

      const item: ItemPagamento = {
        descricao: descricao,
        formaPagamento: formaSelecionada ? formaSelecionada.nome : '',
        valor: valor
      };

      this.lista.push(item);

      this.form.reset({
        valor: 0,
        descricao: ''
      });
    }
    else {
      this.openDialog("Preencha os campos obrigatórios.");
    }
  }

  finalizar() {
    
  }
}
