import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DateAdapter } from '@angular/material/core';
import { Router } from '@angular/router';
import { DialogComponent } from '../dialog/dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { LocalStorageServiceService } from '../../storage/local-storage-service.service';
import moment from 'moment';
import { PostSiao } from '../../interfaces/PostSiao';
import { SiaoService } from './siao.service';
import { catchError, first, of, tap } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { Status } from '../../interfaces/Status';
import { Siaos } from '../../interfaces/Siaos';

@Component({
  selector: 'app-siao',
  templateUrl: './siao.component.html',
  styleUrl: './siao.component.css'
})
export class SiaoComponent {
  form: FormGroup; 
  formEditar: FormGroup;
  token = "";
  siaoArray: Siaos[] = [];
  pageNumber: number = 1;
  count: number = 0;
  isLoading = true;
  isDetalhar = false;
  isAtualizar = false;
  idEditar = 0;
  searchText: string = '';
  isStatus: Status[] = [
    { id: 0, st: "Agendado" },
    { id: 1, st: "Iniciado" },
    { id: 2, st: "Paralisado" },
    { id: 3, st: "Cancelado" },
    { id: 4, st: "Em Andamento" },
    { id: 5, st: "Finalizado" },
  ];
  Evento = "";
  Coordenadores = "";
  Inicio = "";
  Termino = "";
  Descricao = "";
  Status = "";

  constructor(private fb: FormBuilder, private adapter: DateAdapter<any>, private router: Router, private dialog: MatDialog
    , private localStoreServices: LocalStorageServiceService, private siaoService: SiaoService) {
    this.adapter.setLocale('pt-br');

    this.form = this.fb.group({
      evento: ['', [Validators.required]],
      coordenadores: ['', [Validators.required]],
      descricao: ['', [Validators.required]],
      inicio: ['', [Validators.required]],
      termino: ['', [Validators.required]],
      status: ['', [Validators.required]]
    });

    this.formEditar = this.fb.group({
      evento: ['', [Validators.required]],
      coordenadores: ['', [Validators.required]],
      descricao: ['', [Validators.required]],
      inicio: ['', [Validators.required]],
      termino: ['', [Validators.required]],
      status: ['', [Validators.required]]
    });

    const toke = this.localStoreServices.GetLocalStorage();

    if (toke !== null) {
      this.token = toke;

      this.siaoService.Lista(1, this.token)
        .pipe(
          first(),
          tap(result => {
            if (result.succeeded) {
              this.siaoArray = result.dados.dados;
              this.count = result.dados.count;
              this.pageNumber = result.dados.pageIndex;
            } else {
              this.openDialog(result.errors[0].mensagem);
            }
            this.isLoading = false;
          }),
          catchError((error: HttpErrorResponse) => {
            this.Errors(error.status);
            this.form.reset();
            this.isLoading = false;
            return of(null);
          })
        )
        .subscribe();
    } else {
      this.Redirecionar();
    }
  }

  novo() {
    if (this.token !== "") {
      if (this.form.valid) {
        let newDateInicio: moment.Moment = moment.utc(this.form.value.inicio).local();
        this.form.value.inicio = newDateInicio.format("YYYY-MM-DD");
        let newDateTermino: moment.Moment = moment.utc(this.form.value.termino).local();
        this.form.value.termino = newDateTermino.format("YYYY-MM-DD");

        const { evento, coordenadores, descricao, inicio, termino, status } = this.form.value;

        const postSiao: PostSiao = { evento: evento, coordenadores: coordenadores, descricao: descricao, inicio: inicio, termino: termino, status: status };

        this.siaoService.postSiao(postSiao, this.token)
          .pipe(
            first(),
            tap(result => {
              if (result.succeeded) {
                this.openDialog("Registrado com sucesso.");
                this.siaoService.Lista(1, this.token)
                  .pipe(
                    first(),
                    tap(result => {
                      if (result.succeeded) {
                        this.siaoArray = result.dados.dados;
                        this.count = result.dados.count;
                        this.pageNumber = result.dados.pageIndex;
                      } else {
                        this.openDialog(result.errors[0].mensagem);
                      }
                      this.isLoading = false;
                    }),
                    catchError((error: HttpErrorResponse) => {
                      this.Errors(error.status);
                      this.form.reset();
                      this.isLoading = false;
                      return of(null);
                    })
                  )
                  .subscribe();
              } else {
                this.openDialog(result.errors[0].mensagem);
              }
              this.form.reset();
            }),
            catchError((error: HttpErrorResponse) => {
              this.Errors(error.status);
              this.form.reset();
              return of(null);
            })
          )
          .subscribe()
      } else {
        this.openDialog('Preencha as informações');
      }
    } else {
      this.Redirecionar();
    }
  }

  private Redirecionar() {
    this.router.navigate(['/login']);
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

  Editar(id: number) {
    this.isDetalhar = false;
    this.isAtualizar = true;
    this.idEditar = id;

    this.siaoService.Detalhar(id, this.token)
      .pipe(
        first(),
        tap(result => {
          if (result.succeeded) {
            this.formEditar.patchValue({
              coordenadores: result.dados.coordenadores,
              evento: result.dados.evento,
              inicio: result.dados.inicio,
              termino: result.dados.termino,
              descricao: result.dados.descricao,
            });

            this.formEditar.get('status')!.setValue(result.dados.status);
          } else {
            this.openDialog(result.errors[0].mensagem);
          }
        }),
        catchError((error: HttpErrorResponse) => {
          this.Errors(error.status);
          this.isLoading = false;
          this.form.reset();
          return of(null);
        })
      )
      .subscribe();
  }

  Detalhar(id: number) {

    this.isDetalhar = true;
    this.isAtualizar = false;

    this.siaoService.Detalhar(id, this.token)
      .pipe(
        first(),
        tap(result => {
          if (result.succeeded) {
            this.Evento = result.dados.evento;
            this.Coordenadores = result.dados.coordenadores;
            this.Inicio = this.formatDate(result.dados.inicio);
            this.Termino = this.formatDate(result.dados.termino);
            this.Descricao = result.dados.descricao;
            this.Status = this.getStatusName(result.dados.status);
          } else {
            this.openDialog(result.errors[0].mensagem);
          }
        }),
        catchError((error: HttpErrorResponse) => {
          this.Errors(error.status);
          this.isLoading = false;
          this.form.reset();
          return of(null);
        })
      )
      .subscribe();
  }

  onPageChange(event: number) {
    this.isLoading = true;

    this.siaoService.Lista(event, this.token)
      .pipe(
        first(),
        tap(result => {
          if (result.succeeded) {
            this.siaoArray = result.dados.dados;
            this.count = result.dados.count;
            this.pageNumber = result.dados.pageIndex;
          } else {
            this.openDialog(result.errors[0].mensagem);
          }
          this.isLoading = false;
        }),
        catchError((error: HttpErrorResponse) => {
          this.Errors(error.status);
          this.form.reset();
          this.isLoading = false;
          return of(null);
        })
      )
      .subscribe();
  }

  openDialog(p: string): void {
    const dialogRef = this.dialog.open(DialogComponent, {
      data: { titulo: 'Login', paragrafo: p },
      width: '350px',
    });

    dialogRef.afterClosed().subscribe(result => {
    });
  }

  getStatusName(statusId: number): string {
    const status = this.isStatus.find(item => item.id === statusId);
    return status ? status.st : 'Desconhecido';
  }

  formatDate(date: Date): string {

    let newDateInicio: moment.Moment = moment(date);
    let data = newDateInicio.format("DD-MM-YYYY");

    return data;
  }

  get filteredSiaoArray() {
    if (!this.searchText.trim()) {
      return this.siaoArray;
    }

    return this.siaoArray.filter(item =>
      item.evento.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }

  Atualizar() {
    if (this.formEditar.valid) {

      const { evento, coordenadores, descricao, inicio, termino, status } = this.formEditar.value;

      const postSiao: Siaos = { id: this.idEditar, evento: evento, coordenadores: coordenadores, descricao: descricao, inicio: inicio, termino: termino, status: status };


      this.siaoService.Editar(postSiao, this.token)
        .pipe(
          first(),
          tap(result => {
            if (result.succeeded) {
              this.siaoService.Lista(1, this.token)
                .pipe(
                  first(),
                  tap(result => {
                    if (result.succeeded) {
                      this.siaoArray = result.dados.dados;
                      this.count = result.dados.count;
                      this.pageNumber = result.dados.pageIndex;
                    } else {
                      this.openDialog(result.errors[0].mensagem);
                    }
                    this.isLoading = false;
                  }),
                  catchError((error: HttpErrorResponse) => {
                    this.Errors(error.status);
                    this.form.reset();
                    this.isLoading = false;
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
            this.form.reset();
            this.isLoading = false;
            return of(null);
          })
        )
        .subscribe();
    } else {
      this.openDialog("Preencha os dados necessários.");
    }
  }
}
