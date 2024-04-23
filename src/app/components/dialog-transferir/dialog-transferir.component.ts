import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { LocalStorageServiceService } from '../../storage/local-storage-service.service';
import { DialogEventoComponent } from '../dialog-evento/dialog-evento.component';
import { PagamentosService } from '../pagamentos/pagamentos.service';
import { DialogInteracaoComponent } from '../dialog-interacao/dialog-interacao.component';
import { HttpErrorResponse } from '@angular/common/http';
import { first, tap, catchError, of } from 'rxjs';
import { DialogComponent } from '../dialog/dialog.component';
import { ListaInscricoes } from '../pagamentos/ListaInscricoes';
import { FichaConectadoService } from '../ficha-conectado/ficha-conectado.service';
import { FichaParametros } from '../../interfaces/FichaParametros';
import { DialogTransferencia } from './DialogTransferencia';
import { TransferenciaDto } from '../../interfaces/TransferenciaDto';
import { ErrorsService } from '../errors/errors.service';

@Component({
  selector: 'app-dialog-transferir',
  templateUrl: './dialog-transferir.component.html',
  styleUrl: './dialog-transferir.component.css'
})
export class DialogTransferirComponent {
  id = 0;
  siao = 0;
  tipo = 0;
  token = "";
  fichas: ListaInscricoes[] = [];
  searchText: string = '';
  pageNumber: number = 1;
  count: number = 0;

  constructor(
    public dialogRef: MatDialogRef<DialogEventoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogTransferencia, private dialog: MatDialog, private fichaInscricoes: FichaConectadoService
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

    const lista: FichaParametros = { evento: this.siao, tipo: this.tipo, skip: 1, pageSize: 5 };

    this.fichaInscricoes.listaNaoConfirmados(lista, this.token)
      .pipe(
        first(),
        tap(result => {
          this.fichas = result.dados.dados;

          this.count = result.dados.count;
          this.pageNumber = result.dados.pageIndex;
        }),
        catchError((error: HttpErrorResponse) => {
          this.errorServices.Errors(error);
          return of(null);
        })
      )
      .subscribe();
  }

  OK(id: number) {
    this.openDialog("Tem certeza que deseja transferir o pagamento?", id);
  }

  Fechar(): void {
    this.dialogRef.close({});
  }

  openDialog(p: string, id: number): void {
    const dialogRef = this.dialog.open(DialogInteracaoComponent, {
      data: { titulo: 'Transferência', paragrafo: p },
      width: '350px',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result.atualizar === true) {
        const transferir: TransferenciaDto = {
          idRecebedor: id,
          idTransferidor: this.id,
          obs: "",
          siao: this.siao,
          tipo: this.tipo
        }

        this.pagamentoServices.transferir(this.token, transferir)
          .pipe(
            first(),
            tap(result => {
              this.openDialogError("Transferência realizada com sucesso.");
            }),
            catchError((error: HttpErrorResponse) => {
              this.errorServices.Errors(error);
              return of(null);
            })
          )
          .subscribe();
      }
    });
  }

  openDialogError(p: string): void {
    const dialogRef = this.dialog.open(DialogComponent, {
      data: { titulo: 'Transferência', paragrafo: p },
      width: '350px',
    });

    dialogRef.afterClosed().subscribe(result => {
      this.dialogRef.close({});
    });
  }

  onPageChange(id: number) {

    const lista: FichaParametros = { evento: this.siao, tipo: this.tipo, skip: id, pageSize: 5 };

    this.fichaInscricoes.lista(lista, this.token)
      .pipe(
        first(),
        tap(result => {
          this.fichas = result.dados.dados;

          this.count = result.dados.count;
          this.pageNumber = result.dados.pageIndex;
        }),
        catchError((error: HttpErrorResponse) => {
          this.errorServices.Errors(error);
          return of(null);
        })
      )
      .subscribe();
  }

  get filteredEventoArray() {
    if (!this.searchText.trim()) {
      return this.fichas;
    }

    return this.fichas.filter(item =>
      item.nome.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }

}

