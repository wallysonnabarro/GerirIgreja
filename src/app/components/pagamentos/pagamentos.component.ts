import { Component } from '@angular/core';
import { Tipo } from '../../interfaces/Tipo';
import { Eventos } from '../../interfaces/Eventos';
import { HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { first, tap, catchError, of } from 'rxjs';
import { SiaoService } from '../siao/siao.service';
import { DialogComponent } from '../dialog/dialog.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FichaConectadoService } from '../ficha-conectado/ficha-conectado.service';
import { FichaParametros } from '../../interfaces/FichaParametros';
import { LocalStorageServiceService } from '../../storage/local-storage-service.service';
import { Router } from '@angular/router';
import { ListaInscricoes } from './ListaInscricoes';
import { ConfirmarDialogComponent } from '../confirmar-dialog/confirmar-dialog.component';
import { DialogInteracaoComponent } from '../dialog-interacao/dialog-interacao.component';
import { PagamentosService } from './pagamentos.service';
import { PagamentoCancelar } from '../../interfaces/PagamentoCancelar';
import { DialogTransferirComponent } from '../dialog-transferir/dialog-transferir.component';
import { AtualizarDialogComponent } from '../atualizar-dialog/atualizar-dialog.component';

@Component({
  selector: 'app-pagamentos',
  templateUrl: './pagamentos.component.html',
  styleUrl: './pagamentos.component.css'
})
export class PagamentosComponent {

  tipo: Tipo[] = [
    { id: 1, nome: 'Voluntários' },
    { id: 2, nome: 'Consumidores' },
  ];

  eventos: Eventos[] = [];
  form: FormGroup;
  TipoSelecionado = 0;
  EventoSelecionado = 0;
  token = "";
  fichas: ListaInscricoes[] = [];
  totalConfirmadoH = 0;
  totalConfirmadoF = 0;
  totalNConfirmadoM = 0;
  totalNConfirmadoF = 0;
  totalF = 0;
  totalM = 0;
  searchText: string = '';
  pageNumber: number = 1;
  count: number = 0;

  constructor(private fb: FormBuilder, private dialog: MatDialog, private siaoService: SiaoService, private fichaInscricoes: FichaConectadoService,
    private localStoreServices: LocalStorageServiceService, private router: Router, private pagamentoServices: PagamentosService) {
    this.form = this.fb.group({
      evento: [0, [Validators.required]],
      tipo: [0, [Validators.required]],
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

  private Redirecionar() {
    this.router.navigate(['/login']);
  }

  openDialog(p: string): void {
    const dialogRef = this.dialog.open(DialogComponent, {
      data: { titulo: 'Pagamentos', paragrafo: p },
      width: '350px',
    });

    dialogRef.afterClosed().subscribe(result => {
    });
  }

  openDialogConfirmacao(p: string, id: number): void {
    const dadosEvento = this.fichas.find(x => x.id == id);

    if (dadosEvento !== null) {
      let nome = dadosEvento?.nome;

      const dialogRef = this.dialog.open(ConfirmarDialogComponent, {
        data: {
          titulo: 'Confirmar', paragrafo: `Realize o pagamento do consumidor: ${nome}`
          , id: id, siao: this.EventoSelecionado, tipo: this.TipoSelecionado
        },
        width: '580px',
      });

      dialogRef.afterClosed().subscribe(result => {

        const lista: FichaParametros = { evento: this.EventoSelecionado, tipo: this.TipoSelecionado, skip: 1, pageSize: 10 };

        this.fichaInscricoes.lista(lista, this.token)
          .pipe(
            first(),
            tap(result => {
              if (result.succeeded) {
                if (result.succeeded) {
                  this.fichas = result.dados.dados;
                  this.totalConfirmadoF = result.dados.feminino.totalConfirmado;
                  this.totalNConfirmadoF = result.dados.feminino.totalNaoConfirmado;
                  this.totalF = result.dados.feminino.totalGeral;

                  this.totalConfirmadoH = result.dados.masculino.totalConfirmado;
                  this.totalNConfirmadoM = result.dados.masculino.totalNaoConfirmado;
                  this.totalM = result.dados.masculino.totalGeral;

                  this.count = result.dados.count;
                  this.pageNumber = result.dados.pageIndex;
                } else {
                  this.openDialog(result.errors[0].mensagem);
                }
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
      });
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

  eventoSelecionado() {
    const { evento, tipo } = this.form.value;

    if (this.EventoSelecionado === 0) {
      this.TipoSelecionado = this.tipo[0].id;
      this.EventoSelecionado = evento;
    } else {
      this.EventoSelecionado = evento;
      this.TipoSelecionado = tipo;
    }

    const lista: FichaParametros = { evento: this.EventoSelecionado, tipo: this.TipoSelecionado, skip: 1, pageSize: 10 };

    this.fichaInscricoes.lista(lista, this.token)
      .pipe(
        first(),
        tap(result => {
          if (result.succeeded) {
            if (result.succeeded) {
              this.fichas = result.dados.dados;
              this.totalConfirmadoF = result.dados.feminino.totalConfirmado;
              this.totalNConfirmadoF = result.dados.feminino.totalNaoConfirmado;
              this.totalF = result.dados.feminino.totalGeral;

              this.totalConfirmadoH = result.dados.masculino.totalConfirmado;
              this.totalNConfirmadoM = result.dados.masculino.totalNaoConfirmado;
              this.totalM = result.dados.masculino.totalGeral;

              this.count = result.dados.count;
              this.pageNumber = result.dados.pageIndex;
            } else {
              this.openDialog(result.errors[0].mensagem);
            }
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

  tipoSelecionado() {
    const { evento, tipo } = this.form.value;

    if (this.EventoSelecionado === 0) {
      this.EventoSelecionado = this.eventos[0].id;
      this.TipoSelecionado = tipo;
    } else {
      this.EventoSelecionado = evento;
      this.TipoSelecionado = tipo;
    }

    const lista: FichaParametros = { evento: this.EventoSelecionado, tipo: this.TipoSelecionado, skip: 1, pageSize: 10 };

    this.fichaInscricoes.lista(lista, this.token)
      .pipe(
        first(),
        tap(result => {
          if (result.succeeded) {
            this.fichas = result.dados.dados;
            this.totalConfirmadoF = result.dados.feminino.totalConfirmado;
            this.totalNConfirmadoF = result.dados.feminino.totalNaoConfirmado;
            this.totalF = result.dados.feminino.totalGeral;

            this.totalConfirmadoH = result.dados.masculino.totalConfirmado;
            this.totalNConfirmadoM = result.dados.masculino.totalNaoConfirmado;
            this.totalM = result.dados.masculino.totalGeral;
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

  get filteredEventoArray() {
    if (!this.searchText.trim()) {
      return this.fichas;
    }

    return this.fichas.filter(item =>
      item.nome.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }

  Confirmar(id: number) {
    this.openDialogConfirmacao("", id);
  }

  Cancelar(id: number) {
    const dadosEvento = this.fichas.find(x => x.id == id);

    if (dadosEvento !== null) {
      let nome = dadosEvento?.nome;

      const dialogRef = this.dialog.open(DialogInteracaoComponent, {
        data: {
          titulo: 'Cancelar', paragrafo: `Deseja realmente cancelar o pagamento do: ${nome}`
          , id: id, siao: this.EventoSelecionado, tipo: this.TipoSelecionado
        },
        width: '580px',
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result.atualizar === true) {
          const cancelar: PagamentoCancelar = {
            id: id,
            siao: this.EventoSelecionado,
            tipo: this.TipoSelecionado
          }

          this.pagamentoServices.cancelar(this.token, cancelar)
            .pipe(
              first(),
              tap(result => {
                if (result.succeeded) {
                  this.openDialog("Cancelado com sucesso.");

                  const lista: FichaParametros = { evento: this.EventoSelecionado, tipo: this.TipoSelecionado, skip: 1, pageSize: 10 };

                  this.fichaInscricoes.lista(lista, this.token)
                    .pipe(
                      first(),
                      tap(result => {
                        if (result.succeeded) {
                          if (result.succeeded) {
                            this.fichas = result.dados.dados;
                            this.totalConfirmadoF = result.dados.feminino.totalConfirmado;
                            this.totalNConfirmadoF = result.dados.feminino.totalNaoConfirmado;
                            this.totalF = result.dados.feminino.totalGeral;

                            this.totalConfirmadoH = result.dados.masculino.totalConfirmado;
                            this.totalNConfirmadoM = result.dados.masculino.totalNaoConfirmado;
                            this.totalM = result.dados.masculino.totalGeral;

                            this.count = result.dados.count;
                            this.pageNumber = result.dados.pageIndex;
                          } else {
                            this.openDialog(result.errors[0].mensagem);
                          }
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
      });
    }
  }

  Transferir(id: number) {

    const dadosEvento = this.fichas.find(x => x.id == id);

    if (dadosEvento !== null) {
      let nome = dadosEvento?.nome;

      const dialogRef = this.dialog.open(DialogTransferirComponent, {
        data: {
          titulo: 'Cancelar', paragrafo: "Transferência de pagamento(s):"
          , id: id, siao: this.EventoSelecionado, tipo: this.TipoSelecionado, nome: nome
        },
        width: '800px',
      });

      dialogRef.afterClosed().subscribe(result => {
        const lista: FichaParametros = { evento: this.EventoSelecionado, tipo: this.TipoSelecionado, skip: 1, pageSize: 10 };

        this.fichaInscricoes.lista(lista, this.token)
          .pipe(
            first(),
            tap(result => {
              if (result.succeeded) {
                if (result.succeeded) {
                  this.fichas = result.dados.dados;
                  this.totalConfirmadoF = result.dados.feminino.totalConfirmado;
                  this.totalNConfirmadoF = result.dados.feminino.totalNaoConfirmado;
                  this.totalF = result.dados.feminino.totalGeral;

                  this.totalConfirmadoH = result.dados.masculino.totalConfirmado;
                  this.totalNConfirmadoM = result.dados.masculino.totalNaoConfirmado;
                  this.totalM = result.dados.masculino.totalGeral;

                  this.count = result.dados.count;
                  this.pageNumber = result.dados.pageIndex;
                } else {
                  this.openDialog(result.errors[0].mensagem);
                }
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
      });
    }
  }

  Atualizar(id: number) {
    const dadosEvento = this.fichas.find(x => x.id == id);

    if (dadosEvento !== null) {
      let nome = dadosEvento?.nome;

      const dialogRef = this.dialog.open(AtualizarDialogComponent, {
        data: {
          titulo: 'Confirmar', paragrafo: `Realize o pagamento do consumidor: ${nome}`
          , id: id, siao: this.EventoSelecionado, tipo: this.TipoSelecionado
        },
        width: '580px',
      });

      dialogRef.afterClosed().subscribe(result => {

        const lista: FichaParametros = { evento: this.EventoSelecionado, tipo: this.TipoSelecionado, skip: 1, pageSize: 10 };

        this.fichaInscricoes.lista(lista, this.token)
          .pipe(
            first(),
            tap(result => {
              if (result.succeeded) {
                if (result.succeeded) {
                  this.fichas = result.dados.dados;
                  this.totalConfirmadoF = result.dados.feminino.totalConfirmado;
                  this.totalNConfirmadoF = result.dados.feminino.totalNaoConfirmado;
                  this.totalF = result.dados.feminino.totalGeral;

                  this.totalConfirmadoH = result.dados.masculino.totalConfirmado;
                  this.totalNConfirmadoM = result.dados.masculino.totalNaoConfirmado;
                  this.totalM = result.dados.masculino.totalGeral;

                  this.count = result.dados.count;
                  this.pageNumber = result.dados.pageIndex;
                } else {
                  this.openDialog(result.errors[0].mensagem);
                }
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
      });
    }
  }

  onPageChange(id: number) {

    const lista: FichaParametros = { evento: this.EventoSelecionado, tipo: this.TipoSelecionado, skip: id, pageSize: 10 };

    this.fichaInscricoes.lista(lista, this.token)
      .pipe(
        first(),
        tap(result => {
          if (result.succeeded) {
            if (result.succeeded) {
              this.fichas = result.dados.dados;
              this.totalConfirmadoF = result.dados.feminino.totalConfirmado;
              this.totalNConfirmadoF = result.dados.feminino.totalNaoConfirmado;
              this.totalF = result.dados.feminino.totalGeral;

              this.totalConfirmadoH = result.dados.masculino.totalConfirmado;
              this.totalNConfirmadoM = result.dados.masculino.totalNaoConfirmado;
              this.totalM = result.dados.masculino.totalGeral;

              this.count = result.dados.count;
              this.pageNumber = result.dados.pageIndex;
            } else {
              this.openDialog(result.errors[0].mensagem);
            }
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
}
