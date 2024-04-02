import { Component } from '@angular/core';
import { Tribos } from './tribos';
import { TribosService } from './tribos.service';
import { LocalStorageServiceService } from '../../storage/local-storage-service.service';
import { catchError, first, of, tap } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { DialogComponent } from '../dialog/dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TriboNovo } from '../../interfaces/TriboNovo';
import { Router } from '@angular/router';
import { Status } from '../../interfaces/Status';

@Component({
  selector: 'app-tribos',
  templateUrl: './tribos.component.html',
  styleUrl: './tribos.component.css'
})
export class TribosComponent {

  triboArray: Tribos[] = [];
  isStatus: Status[] = [
    { id: 0, st: "Inativo" },
    { id: 1, st: "Ativo" }
  ];
  isLoading = false;
  pageNumber: number = 1;
  count: number = 0;
  form: FormGroup;
  formEditar: FormGroup;
  isDetalhar = false;
  isAtualizar = false;
  triboDetalhe = "";
  triboStatus = "";
  idEditar = 0;

  constructor(private triboServices: TribosService, private localStoreServices: LocalStorageServiceService, private dialog: MatDialog
    , private fb: FormBuilder, private router: Router) {

    this.form = this.fb.group({
      nome: ['', [Validators.required]]
    });

    this.formEditar = this.fb.group({
      nome: ['', [Validators.required]],
      status: ['', [Validators.required]]
    });

    const token = this.localStoreServices.GetLocalStorage();

    if (token !== null) {
      this.triboServices.Lista(1, token)
        .pipe(
          first(),
          tap(result => {
            if (result.succeeded) {
              this.triboArray = result.dados.dados;
              this.count = result.dados.count;
              this.pageNumber = result.dados.pageIndex;
            }
          }),
          catchError((error: HttpErrorResponse) => {
            let errorMessage = "";

            if (error.status === 403) {
              errorMessage = 'Acesso negado.';
            } else if (error.status === 401) {
              errorMessage = 'Não autorizado.';
            } else if (error.status === 500) {
              errorMessage = 'Erro interno do servidor.';
            } else if (error.status === 0) {
              errorMessage = 'Erro de conexão: O servidor não está ativo ou não responde.';
            } else if (error.message && error.message.includes('ERR_CONNECTION_REFUSED')) {
              errorMessage = 'Erro de conexão: O servidor recusou a conexão.';
            }

            this.openDialog(errorMessage);
            this.isLoading = false;
            return of(null);
          })
        )
        .subscribe();
    }
  }

  onPageChange(event: number) {
    const token = this.localStoreServices.GetLocalStorage();

    if (token !== null) {
      this.triboServices.Lista(event, token)
        .pipe(
          first(),
          tap(result => {
            if (result.succeeded) {
              this.triboArray = result.dados.dados;
              this.count = result.dados.count;
              this.pageNumber = result.dados.pageIndex;
            }
          }),
          catchError((error: HttpErrorResponse) => {
            let errorMessage = "";

            if (error.status === 403) {
              errorMessage = 'Acesso negado.';
            } else if (error.status === 401) {
              errorMessage = 'Não autorizado.';
            } else if (error.status === 500) {
              errorMessage = 'Erro interno do servidor.';
            } else if (error.status === 0) {
              errorMessage = 'Erro de conexão: O servidor não está ativo ou não responde.';
            } else if (error.message && error.message.includes('ERR_CONNECTION_REFUSED')) {
              errorMessage = 'Erro de conexão: O servidor recusou a conexão.';
            }

            this.openDialog(errorMessage);
            this.isLoading = false;
            return of(null);
          })
        ).subscribe();
    } else {
      this.router.navigate(['/login']);
    }
  }

  novo() {
    const token = this.localStoreServices.GetLocalStorage();

    if (token !== null) {
      if (this.form.valid) {

        const { nome } = this.form.value;

        const tribo: TriboNovo = { nome: nome };

        this.triboServices.Novo(tribo, token)
          .pipe(
            first(),
            tap(result => {
              if (result.succeeded) {
                this.openDialog("Registrado com sucesso.");

                this.form.reset();
                this.triboArray.push(result.dados);
              } else {
                this.openDialog(result.errors[0].mensagem);
                this.form.reset();
              }
            }),
            catchError((error: HttpErrorResponse) => {
              let errorMessage = "";

              if (error.status === 403) {
                errorMessage = 'Acesso negado.';
              } else if (error.status === 401) {
                errorMessage = 'Não autorizado.';
              } else if (error.status === 500) {
                errorMessage = 'Erro interno do servidor.';
              } else if (error.status === 0) {
                errorMessage = 'Erro de conexão: O servidor não está ativo ou não responde.';
              } else if (error.message && error.message.includes('ERR_CONNECTION_REFUSED')) {
                errorMessage = 'Erro de conexão: O servidor recusou a conexão.';
              }

              this.openDialog(errorMessage);
              this.isLoading = false;
              this.form.reset();
              return of(null);
            })
          )
          .subscribe();
      } else {
        this.openDialog('Você deve inserir uma tribo ou equipe!');
      }
    } else {
      this.router.navigate(['/login']);
    }
  }

  Editar(id: number) {

    const token = this.localStoreServices.GetLocalStorage();

    if (token !== null) {
      this.idEditar = id;
      this.isAtualizar = true;
      this.isDetalhar = false;

      this.triboServices.Detalhar(id, token)
        .pipe(
          first(),
          tap(result => {
            if (result.succeeded) {
              this.formEditar.patchValue({
                nome: result.dados.nome
              });

              this.formEditar.get('status')!.setValue(result.dados.status);
            } else {
              this.openDialog(result.errors[0].mensagem);
            }
          }),
          catchError((error: HttpErrorResponse) => {
            let errorMessage = "";

            if (error.status === 403) {
              errorMessage = 'Acesso negado.';
            } else if (error.status === 401) {
              errorMessage = 'Não autorizado.';
            } else if (error.status === 500) {
              errorMessage = 'Erro interno do servidor.';
            } else if (error.status === 0) {
              errorMessage = 'Erro de conexão: O servidor não está ativo ou não responde.';
            } else if (error.message && error.message.includes('ERR_CONNECTION_REFUSED')) {
              errorMessage = 'Erro de conexão: O servidor recusou a conexão.';
            }

            this.openDialog(errorMessage);
            this.isLoading = false;
            this.form.reset();
            return of(null);
          })
        )
        .subscribe();
    } else {
      this.router.navigate(['/login']);
    }
  }

  Atualizar() {

    const token = this.localStoreServices.GetLocalStorage();

    if (token !== null) {

      const { nome, status } = this.formEditar.value;

      const tribo: Tribos = { id: this.idEditar, nome: nome, status: status };

      this.triboServices.Editar(tribo, token)
        .pipe(
          first(),
          tap(result => {
            if (result.succeeded) {
              this.triboServices.Lista(1, token)
                .pipe(
                  first(),
                  tap(result => {
                    if (result.succeeded) {
                      this.triboArray = result.dados.dados;
                      this.count = result.dados.count;
                      this.pageNumber = result.dados.pageIndex;
                    }
                  }),
                  catchError((error: HttpErrorResponse) => {
                    let errorMessage = "";

                    if (error.status === 403) {
                      errorMessage = 'Acesso negado.';
                    } else if (error.status === 401) {
                      errorMessage = 'Não autorizado.';
                    } else if (error.status === 500) {
                      errorMessage = 'Erro interno do servidor.';
                    } else if (error.status === 0) {
                      errorMessage = 'Erro de conexão: O servidor não está ativo ou não responde.';
                    } else if (error.message && error.message.includes('ERR_CONNECTION_REFUSED')) {
                      errorMessage = 'Erro de conexão: O servidor recusou a conexão.';
                    }

                    this.openDialog(errorMessage);
                    this.isLoading = false;
                    return of(null);
                  })
                )
                .subscribe();
            } else {
              this.openDialog(result.errors[0].mensagem);
            }

            this.idEditar = 0;
            this.isAtualizar = false;
            this.isDetalhar = false;
          }),
          catchError((error: HttpErrorResponse) => {
            let errorMessage = "";

            if (error.status === 403) {
              errorMessage = 'Acesso negado.';
            } else if (error.status === 401) {
              errorMessage = 'Não autorizado.';
            } else if (error.status === 500) {
              errorMessage = 'Erro interno do servidor.';
            } else if (error.status === 0) {
              errorMessage = 'Erro de conexão: O servidor não está ativo ou não responde.';
            } else if (error.message && error.message.includes('ERR_CONNECTION_REFUSED')) {
              errorMessage = 'Erro de conexão: O servidor recusou a conexão.';
            }

            this.openDialog(errorMessage);
            this.isLoading = false;
            this.form.reset();
            return of(null);
          })
        )
        .subscribe();

    } else {
      this.router.navigate(['/login']);
    }
  }

  Detalhar(id: number) {
    this.isDetalhar = true;
    this.isAtualizar = false;

    const token = this.localStoreServices.GetLocalStorage();

    if (token !== null) {
      this.triboServices.Detalhar(id, token)
        .pipe(
          first(),
          tap(result => {
            if (result.succeeded) {
              this.triboDetalhe = result.dados.nome;
              this.triboStatus = result.dados.status === 1 ? "Ativo" : "Inativo";
            } else {
              this.openDialog(result.errors[0].mensagem);
            }
          }),
          catchError((error: HttpErrorResponse) => {
            let errorMessage = "";

            if (error.status === 403) {
              errorMessage = 'Acesso negado.';
            } else if (error.status === 401) {
              errorMessage = 'Não autorizado.';
            } else if (error.status === 500) {
              errorMessage = 'Erro interno do servidor.';
            } else if (error.status === 0) {
              errorMessage = 'Erro de conexão: O servidor não está ativo ou não responde.';
            } else if (error.message && error.message.includes('ERR_CONNECTION_REFUSED')) {
              errorMessage = 'Erro de conexão: O servidor recusou a conexão.';
            }

            this.openDialog(errorMessage);
            this.isLoading = false;
            this.form.reset();
            return of(null);
          })
        )
        .subscribe();
    } else {
      this.router.navigate(['/login']);
    }
  }

  openDialog(p: string): void {
    const dialogRef = this.dialog.open(DialogComponent, {
      data: { titulo: 'Login', paragrafo: p },
      width: '350px',
    });

    dialogRef.afterClosed().subscribe(result => {
    });
  }
}
