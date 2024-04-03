import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DateAdapter } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { LocalStorageServiceService } from '../../storage/local-storage-service.service';
import { Areas } from '../../interfaces/Areas';
import { AreasService } from './areas.service';
import { catchError, first, of, tap } from 'rxjs';
import { DialogComponent } from '../dialog/dialog.component';
import { HttpErrorResponse } from '@angular/common/http';
import { PostAreas } from '../../interfaces/PostAreas';

@Component({
  selector: 'app-areas',
  templateUrl: './areas.component.html',
  styleUrl: './areas.component.css'
})
export class AreasComponent {

  form: FormGroup;
  formEditar: FormGroup;
  token = "";
  areasArray: Areas[] = [];
  pageNumber: number = 1;
  count: number = 0;
  isLoading = true;
  isDetalhar = false;
  isAtualizar = false;
  idEditar = 0;
  searchText: string = '';
  Nome = "";

  constructor(private fb: FormBuilder, private adapter: DateAdapter<any>, private router: Router, private dialog: MatDialog
    , private localStoreServices: LocalStorageServiceService, private areasServices: AreasService) {
    this.form = this.fb.group({
      nome: ['', [Validators.required]]
    });

    this.formEditar = this.fb.group({
      nome: ['', [Validators.required]]
    });

    const toke = this.localStoreServices.GetLocalStorage();
    if (toke !== null) {
      this.token = toke;

      this.areasServices.Lista(1, this.token)
        .pipe(
          first(),
          tap(result => {
            if (result.succeeded) {
              if (result.dados.dados.length > 0) {
                this.areasArray = result.dados.dados;
                this.count = result.dados.count;
                this.pageNumber = result.dados.pageIndex;
              }
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

        const { nome } = this.form.value;

        const postAreas: PostAreas = { nome: nome };

        this.areasServices.PostAreas(postAreas, this.token)
          .pipe(
            first(),
            tap(result => {
              if (result.succeeded) {
                this.openDialog("Registrado com sucesso.");
                this.areasServices.Lista(1, this.token)
                  .pipe(
                    first(),
                    tap(result => {
                      if (result.succeeded) {
                        this.areasArray = result.dados.dados;
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

  Editar(id: number) {
    this.isDetalhar = false;
    this.isAtualizar = true;
    this.idEditar = id;

    this.areasServices.Detalhar(id, this.token)
      .pipe(
        first(),
        tap(result => {
          if (result.succeeded) {
            this.formEditar.patchValue({
              nome: result.dados.nome,
            });
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

    this.areasServices.Detalhar(id, this.token)
      .pipe(
        first(),
        tap(result => {
          if (result.succeeded) {
            this.Nome = result.dados.nome;
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

    this.areasServices.Lista(event, this.token)
      .pipe(
        first(),
        tap(result => {
          if (result.succeeded) {
            this.areasArray = result.dados.dados;
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

  Atualizar() {
    if (this.formEditar.valid) {

      const { nome } = this.formEditar.value;

      const postAreas: Areas = { id: this.idEditar, nome: nome };

      this.areasServices.Editar(postAreas, this.token)
        .pipe(
          first(),
          tap(result => {
            if (result.succeeded) {
              this.areasServices.Lista(1, this.token)
                .pipe(
                  first(),
                  tap(result => {
                    if (result.succeeded) {
                      this.areasArray = result.dados.dados;
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

  openDialog(p: string): void {
    const dialogRef = this.dialog.open(DialogComponent, {
      data: { titulo: 'Login', paragrafo: p },
      width: '350px',
    });

    dialogRef.afterClosed().subscribe(result => {
    });
  }

  get filteredSiaoArray() {
    if (!this.searchText.trim()) {
      return this.areasArray;
    }

    return this.areasArray.filter(item =>
      item.nome.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }

}
