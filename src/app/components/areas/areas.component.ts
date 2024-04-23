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
import { ErrorsService } from '../errors/errors.service';

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

  constructor(private fb: FormBuilder, private adapter: DateAdapter<any>, private errorServices: ErrorsService, private dialog: MatDialog
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
            this.areasArray = result.dados.dados;
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

        const { nome } = this.form.value;

        const postAreas: PostAreas = { nome: nome };

        this.areasServices.PostAreas(postAreas, this.token)
          .pipe(
            first(),
            tap(result => {
              this.openDialog("Registrado com sucesso.");
              this.areasServices.Lista(1, this.token)
                .pipe(
                  first(),
                  tap(result => {
                    this.areasArray = result.dados.dados;
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

    this.areasServices.Detalhar(id, this.token)
      .pipe(
        first(),
        tap(result => {
          this.formEditar.patchValue({
            nome: result.dados.nome,
          });
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

    this.areasServices.Detalhar(id, this.token)
      .pipe(
        first(),
        tap(result => {
          this.Nome = result.dados.nome;
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

    this.areasServices.Lista(event, this.token)
      .pipe(
        first(),
        tap(result => {
          this.areasArray = result.dados.dados;
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

  Atualizar() {
    if (this.formEditar.valid) {

      const { nome } = this.formEditar.value;

      const postAreas: Areas = { id: this.idEditar, nome: nome };

      this.areasServices.Editar(postAreas, this.token)
        .pipe(
          first(),
          tap(result => {
            this.areasServices.Lista(1, this.token)
              .pipe(
                first(),
                tap(result => {
                  this.areasArray = result.dados.dados;
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
