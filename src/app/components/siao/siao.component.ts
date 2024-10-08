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
import { StatusEnum } from '../../enums/StatusEnum';
import { ErrorsService } from '../errors/errors.service';

@Component({
  selector: 'app-siao',
  templateUrl: './siao.component.html',
  styleUrl: './siao.component.css'
})
export class SiaoComponent {
  form: FormGroup;
  formEditar: FormGroup;
  token = "";
  tokenEvento = "";
  siaoArray: Siaos[] = [];
  pageNumber: number = 1;
  count: number = 0;
  isLoading = true;
  isDetalhar = false;
  isAtualizar = false;
  idEditar = 0;
  searchText: string = '';
  isStatus: Status[] = [
    { id: StatusEnum.Agendado, st: "Agendado" },
    { id: StatusEnum.Iniciado, st: "Iniciado" },
    { id: StatusEnum.Paralisado, st: "Paralisado" },
    { id: StatusEnum.Cancelado, st: "Cancelado" },
    { id: StatusEnum.EmAndamento, st: "Em Andamento" },
    { id: StatusEnum.Finalizado, st: "Finalizado" },
  ];
  Evento = "";
  Coordenadores = "";
  Inicio = "";
  Termino = "";
  Descricao = "";
  Status = "";
  valorBotao = "Copiar para compartilhar";

  constructor(private fb: FormBuilder, private adapter: DateAdapter<any>, private router: Router, private dialog: MatDialog
    , private localStoreServices: LocalStorageServiceService, private siaoService: SiaoService, private errorServices: ErrorsService) {
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
            this.siaoArray = result.dados.dados;
            this.count = result.dados.count;
            this.pageNumber = result.dados.pageIndex;
            this.isLoading = false;
          }),
          catchError((error: HttpErrorResponse) => {
            this.errorServices.Errors(error);
            this.form.reset();
            this.isLoading = false;
            return of(null);
          })
        )
        .subscribe();
    } else {
      this.errorServices.Redirecionar();
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
                      this.siaoArray = result.dados.dados;
                      this.count = result.dados.count;
                      this.pageNumber = result.dados.pageIndex;
                      this.isLoading = false;
                    }),
                    catchError((error: HttpErrorResponse) => {
                      this.errorServices.Errors(error);
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
              this.errorServices.Errors(error);
              this.form.reset();
              return of(null);
            })
          )
          .subscribe()
      } else {
        this.openDialog('Preencha as informações');
      }
    } else {
      this.errorServices.Redirecionar();
    }
  }

  Editar(id: number) {
    this.isDetalhar = false;
    this.isAtualizar = true;
    this.idEditar = id;
    this.valorBotao = "Copiar para compartilhar";

    this.siaoService.Detalhar(id, this.token)
      .pipe(
        first(),
        tap(result => {
          this.formEditar.patchValue({
            coordenadores: result.dados.coordenadores,
            evento: result.dados.nome,
            inicio: result.dados.inicio,
            termino: result.dados.termino,
            descricao: result.dados.descricao
          });

          this.tokenEvento = result.dados.token;

          this.formEditar.get('status')!.setValue(result.dados.status);
        }),
        catchError((error: HttpErrorResponse) => {
          this.errorServices.Errors(error);
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
    this.valorBotao = "Copiar para compartilhar";

    this.siaoService.Detalhar(id, this.token)
      .pipe(
        first(),
        tap(result => {
          this.Evento = result.dados.nome;
          this.Coordenadores = result.dados.coordenadores;
          this.Inicio = this.formatDate(result.dados.inicio);
          this.Termino = this.formatDate(result.dados.termino);
          this.Descricao = result.dados.descricao;
          this.Status = this.getStatusName(result.dados.status);
          this.tokenEvento = result.dados.token;
        }),
        catchError((error: HttpErrorResponse) => {
          this.errorServices.Errors(error);
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
          this.siaoArray = result.dados.dados;
          this.count = result.dados.count;
          this.pageNumber = result.dados.pageIndex;
          this.isLoading = false;
        }),
        catchError((error: HttpErrorResponse) => {
          this.errorServices.Errors(error);
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
      item.nome.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }

  Atualizar() {
    if (this.formEditar.valid) {

      const { evento, coordenadores, descricao, inicio, termino, status } = this.formEditar.value;

      const postSiao: Siaos = { id: this.idEditar, nome: evento, coordenadores: coordenadores, descricao: descricao, inicio: inicio, termino: termino, status: status, token: this.tokenEvento };

      this.siaoService.Editar(postSiao, this.token)
        .pipe(
          first(),
          tap(result => {
            if (result.succeeded) {
              this.siaoService.Lista(1, this.token)
                .pipe(
                  first(),
                  tap(result => {
                    this.siaoArray = result.dados.dados;
                    this.count = result.dados.count;
                    this.pageNumber = result.dados.pageIndex;
                    this.isLoading = false;
                  }),
                  catchError((error: HttpErrorResponse) => {
                    this.errorServices.Errors(error);
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
            this.errorServices.Errors(error);
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

  Copiar() {
    const inputElement = document.createElement('input');
    inputElement.setAttribute('value', this.tokenEvento);
    document.body.appendChild(inputElement);
    inputElement.select();
    document.execCommand('copy');
    document.body.removeChild(inputElement);
    this.valorBotao = "Copiado";
  }
}
