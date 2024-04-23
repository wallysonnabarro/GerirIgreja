import { Component } from '@angular/core';
import { ErrorsService } from '../../../errors/errors.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LocalStorageServiceService } from '../../../../storage/local-storage-service.service';
import { TiposSaidaService } from '../../../../services/tipossaida/tipos-saida.service';
import { Tipo } from '../../../../interfaces/Tipo';
import { catchError, first, of, tap } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { DialogComponent } from '../../../dialog/dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-tipos-saidas',
  templateUrl: './tipos-saidas.component.html',
  styleUrl: './tipos-saidas.component.css'
})
export class TiposSaidasComponent {
  form: FormGroup;
  formEditar: FormGroup;
  token = "";
  tipoArray: Tipo[] = [];
  pageNumber: number = 1;
  count: number = 0;
  isDetalhar = false;
  isAtualizar = false;
  idEditar = 0;
  searchText: string = '';
  Nome = "";

  constructor(private fb: FormBuilder, private errorsServices: ErrorsService, private localStoreServices: LocalStorageServiceService,
    private errorServices: ErrorsService, private tiposSaidas: TiposSaidaService, private dialog: MatDialog
  ) {

    this.form = this.fb.group({
      tipo: ['', [Validators.required]]
    });

    this.formEditar = this.fb.group({
      tipo: ['', [Validators.required]]
    });

    const toke = this.localStoreServices.GetLocalStorage();
    if (toke !== null) {
      this.token = toke;

      this.tiposSaidas.Lista(1, this.token)
        .pipe(
          first(),
          tap(result => {
            this.tipoArray = result.dados.dados;
            this.count = result.dados.count;
            this.pageNumber = result.dados.pageIndex;
          }),
          catchError((error: HttpErrorResponse) => {
            this.errorsServices.Errors(error);
            return of(null);
          })
        )
        .subscribe();
    }
    else {
      this.errorServices.Redirecionar();
    }
  }

  novo() {
    if (this.token) {
      const { tipo } = this.form.value;

      this.tiposSaidas.novo(tipo, this.token)
        .pipe(
          first(),
          tap(result => {
            this.openDialog("Registrado com sucesso.");
            this.carregar();
          }),
          catchError((error: HttpErrorResponse) => {
            this.errorsServices.Errors(error);
            return of(null);
          })
        )
        .subscribe();
    } else {
      this.errorServices.Redirecionar();
    }
  }

  Editar(id: number) {
    if (this.token) {

      this.Nome = this.tipoArray.find(x => x.id === id)?.nome ?? "";

      this.formEditar.patchValue({ tipo: this.Nome });

      this.isDetalhar = false;
      this.isAtualizar = true;
      this.idEditar = id;
    } else {
      this.errorServices.Redirecionar();
    }
  }

  Detalhar(id: number) {
    if (this.token) {

      this.tiposSaidas.detalhar(id, this.token)
        .pipe(
          first(),
          tap(result => {
            this.Nome = result.dados.nome;
            this.isDetalhar = true;
            this.isAtualizar = false;
          }),
          catchError((error: HttpErrorResponse) => {
            this.errorsServices.Errors(error);
            return of(null);
          })
        )
        .subscribe()
    } else {
      this.errorServices.Redirecionar();
    }
  }

  Atualizar() {
    if (this.token) {
      const { tipo } = this.formEditar.value;

      var editarTipo: Tipo = {
        id: this.idEditar,
        nome: tipo
      }

      this.tiposSaidas.editar(editarTipo, this.token)
        .pipe(
          first(),
          tap(result => {
            this.openDialog("Atualizado com sucesso");
            this.isDetalhar = false;
            this.isAtualizar = false;
            this.carregar();
          }),
          catchError((error: HttpErrorResponse) => {
            this.errorsServices.Errors(error);
            return of(null);
          })
        )
        .subscribe();
    } else {
      this.errorServices.Redirecionar();
    }
  }

  onPageChange(event: number) {
    this.tiposSaidas.Lista(event, this.token)
      .pipe(
        first(),
        tap(result => {
          this.tipoArray = result.dados.dados;
          this.count = result.dados.count;
          this.pageNumber = result.dados.pageIndex;
        }),
        catchError((error: HttpErrorResponse) => {
          this.errorServices.Errors(error);
          this.form.reset();
          return of(null);
        })
      )
      .subscribe();
  }

  private carregar() {
    this.tiposSaidas.Lista(1, this.token)
      .pipe(
        first(),
        tap(result => {
          this.tipoArray = result.dados.dados;
          this.count = result.dados.count;
          this.pageNumber = result.dados.pageIndex;
        }),
        catchError((error: HttpErrorResponse) => {
          this.errorsServices.Errors(error);
          return of(null);
        })
      )
      .subscribe();
  }

  get filteredSiaoArray() {
    if (!this.searchText.trim()) {
      return this.tipoArray;
    }

    return this.tipoArray.filter(item =>
      item.nome.toLowerCase().includes(this.searchText.toLowerCase())
    );
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
