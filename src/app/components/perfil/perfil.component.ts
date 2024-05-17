import { Component } from '@angular/core';
import { ContratoSelected } from '../../interfaces/ContratoSelected';
import { selector } from '../../interfaces/seletor';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { LocalStorageServiceService } from '../../storage/local-storage-service.service';
import { ErrorsService } from '../errors/errors.service';
import { catchError, first, of, tap } from 'rxjs';
import { Perfil } from './Perfil';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.css'
})
export class PerfilComponent {

  contratos: ContratoSelected[] = [];
  statusLista: selector[] = [
    { id: 1, nome: 'Ativo' },
    { id: 0, nome: 'Bloqueado' },
  ];
  form: FormGroup;
  formEditar: FormGroup;
  token = "";
  searchText: string = '';
  pageNumber: number = 1;
  count: number = 0;
  PerfilArray: Perfil[] = [];
  isDetalhar = false;
  isAtualizar = false;

  //detalhes
  Nome = "";

  constructor(private fb: FormBuilder, private dialog: MatDialog, private localStoreServices: LocalStorageServiceService,
    private errorServices: ErrorsService
  ) {
    this.form = this.fb.group({
      valor: [0, [Validators.required]],
      evento: [0, [Validators.required]],
      forma: [0, [Validators.required]]
    });

    this.formEditar = this.fb.group({
      nome: ['', [Validators.required]]
    });


    const toke = this.localStoreServices.GetLocalStorage();

    if (toke !== null) {
      this.token = toke;
    } else {
      this.errorServices.Redirecionar();
    }
  }

  contratoSelecionado() {
  }

  statusSelecionado() {

  }

  novo() {

  }

  get filteredPerfilArray() {
    if (!this.searchText.trim()) {
      return this.PerfilArray;
    }

    return this.PerfilArray.filter(item =>
      item.nome.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }

  Editar(id: number) {

  }

  Detalhar(id: number) {

  }

  
  onPageChange(event: number) {

    // this.areasServices.Lista(event, this.token)
    //   .pipe(
    //     first(),
    //     tap(result => {
    //       // this.areasArray = result.dados.dados;
    //       // this.count = result.dados.count;
    //       // this.pageNumber = result.dados.pageIndex;
    //     }),
    //     catchError((error: HttpErrorResponse) => {
    //       this.errorServices.Errors(error);
    //       this.form.reset();
    //       return of(null);
    //     })
    //   )
    //   .subscribe();
  }

  Atualizar(){

  }
}
