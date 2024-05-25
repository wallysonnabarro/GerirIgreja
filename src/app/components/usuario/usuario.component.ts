import { Component } from '@angular/core';
import { ContratoSelected } from '../../interfaces/ContratoSelected';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ContratoservicesService } from '../../services/contrato/contratoservices.service';
import { LocalStorageServiceService } from '../../storage/local-storage-service.service';
import { ErrorsService } from '../errors/errors.service';
import { MyErrorStateMatcher } from './MyErrorStateMatcher';
import { Perfils } from '../../interfaces/Perfils';
import { TriboSelected } from '../../interfaces/TriboSelected';
import { HttpErrorResponse } from '@angular/common/http';
import { first, tap, catchError, of } from 'rxjs';
import { PerfilServicesService } from '../perfil/perfil-services.service';
import { TribosService } from '../tribos/tribos.service';
import { UsuarioLista } from './UsuarioLista';
import { UsuarioService } from './usuario.service';
import { UsuarioNovo } from './UsuarioNovo';
import { DialogComponent } from '../dialog/dialog.component';

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styleUrl: './usuario.component.css'
})
export class UsuarioComponent {

  contratos: ContratoSelected[] = [];
  perfils: Perfils[] = [];
  istriboSelect: TriboSelected[] = [];
  usuarioLista: UsuarioLista[] = [];
  contratoId = 0;
  triboId = 0;
  roleId = 0;
  statusId = 0;
  form: FormGroup;
  formEditar: FormGroup;
  matcher = new MyErrorStateMatcher();
  token = "";
  searchText: string = '';
  pageNumber: number = 1;
  count: number = 0;
  hide = true;

  isDetalhar = false;
  isAtualizar = false;

  //detalhar
  id = 0;
  nome = "";
  tribo = "";
  email = "";
  cpf = "";
  contrato = "";
  userName = "";

  constructor(private fb: FormBuilder, private dialog: MatDialog, private localStoreServices: LocalStorageServiceService,
    private errorServices: ErrorsService, private contratoServices: ContratoservicesService, private perfilService: PerfilServicesService,
    private triboServices: TribosService, private usuarioServices: UsuarioService) {
    this.form = this.fb.group({
      nome: ['', [Validators.required]],
      userName: ['', [Validators.required]],
      cpf: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      senha: ['', [Validators.required]],
      contratoSelecionadoId: ['', [Validators.required]],
      roleSelecionadoId: ['', [Validators.required]],
      triboSelecionadoId: ['', [Validators.required]],
    });
    this.formEditar = this.fb.group({
      nome: ['', [Validators.required]],
      userName: ['', [Validators.required]],
      cpf: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      senha: ['', [Validators.required]],
      contratoSelecionadoId: ['', [Validators.required]],
      roleSelecionadoId: ['', [Validators.required]],
      triboSelecionadoId: ['', [Validators.required]],
    });

    const toke = this.localStoreServices.GetLocalStorage();

    if (toke !== null) { 
      this.token = toke;
      // this.errorServices.Recarregar('/novo-usuario', this.token);
    } else {
      this.errorServices.Redirecionar();
    }

    this.contratoServices.getContratosAtivos(this.token)
      .pipe(
        first(),
        tap(result => {
          this.contratos = result.dados;
        }),
        catchError((error: HttpErrorResponse) => {
          this.errorServices.Errors(error);
          return of(null);
        }))
      .subscribe();

    this.perfilService.ListaPerfilSelected(this.token)
      .pipe(
        first(),
        tap(result => {
          this.perfils = result.dados;
        }),
        catchError((error: HttpErrorResponse) => {
          this.errorServices.Errors(error);
          return of(null);
        }))
      .subscribe();

    this.triboServices.ListaSelectedAll(this.token)
      .pipe(
        first(),
        tap(result => {
          this.istriboSelect = result.dados;
        }),
        catchError((error: HttpErrorResponse) => {
          this.errorServices.Errors(error);
          return of(null);
        })
      )
      .subscribe();

    this.usuarioServices.Lista(1, this.token)
      .pipe(
        first(),
        tap(result => {
          this.usuarioLista = result.dados.dados;
          this.count = result.dados.count;
          this.pageNumber = result.dados.pageIndex;
        }),
        catchError((error: HttpErrorResponse) => {
          this.errorServices.Errors(error);
          return of(null);
        }))
      .subscribe();
  }

  contratoSelecionado() {
    const { contratoSelecionadoId } = this.form.value;
    this.contratoId = contratoSelecionadoId;
  }

  roleSelecionado() {
    const { roleSelecionadoId } = this.form.value;
    this.roleId = roleSelecionadoId;
  }

  triboSelecionado() {
    const { triboSelecionadoId } = this.form.value;
    this.triboId = triboSelecionadoId;
  }

  novo() {
    const { senha, email, cpf, userName, nome, contratoSelecionadoId, roleSelecionadoId, triboSelecionadoId } = this.form.value;

    if (this.triboId === 0) {
      this.openDialog("Selecione uma tribo");
    } else if (this.contratoId === 0) {
      this.openDialog("Selecione um contrato");
    } else if (this.roleId === 0) {
      this.openDialog("Selecione um perfil");
    } else if (senha === "") {
      this.openDialog("Campo senha é obrigatório");
    } else if (email === "") {
      this.openDialog("Campo e-mail é obrigatório");
    } else if (cpf === "") {
      this.openDialog("Campo CPF é obrigatório");
    } else if (userName === "") {
      this.openDialog("Campo nome de usuário é obrigatório");
    } else if (nome === "") {
      this.openDialog("Campo nome completo é obrigatório");
    } else {
      const novoUser: UsuarioNovo = {
        contrato: contratoSelecionadoId,
        cpf: cpf,
        email: email,
        nome: nome,
        role: roleSelecionadoId,
        senha: senha,
        tribo: triboSelecionadoId,
        userName: userName
      };

      this.usuarioServices.novo(this.token, novoUser)
        .pipe(
          first(),
          tap(result => {
            this.openDialog("Registrado com sucesso.");
            this.form.reset();
          }),
          catchError((error: HttpErrorResponse) => {
            this.errorServices.Errors(error);
            return of(null);
          }))
        .subscribe();
    }
  }

  openDialog(p: string): void {
    const dialogRef = this.dialog.open(DialogComponent, {
      data: { titulo: 'Usuario', paragrafo: p },
      width: '350px',
    });

    dialogRef.afterClosed().subscribe(result => {
    });
  }

  get filteredPerfilArray() {
    if (!this.searchText.trim()) {
      return this.usuarioLista;
    }

    return this.usuarioLista.filter(item =>
      item.nome.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }

  Editar(id: number) {
    this.isDetalhar = false;
    this.isAtualizar = true;
    
    const toke = this.localStoreServices.GetLocalStorage();

    if (toke !== null) {
      this.token = toke;
    } else {
      this.errorServices.Redirecionar();
    }

  }

  Detalhar(id: number) {
    this.isDetalhar = true;
    this.isAtualizar = false;
    
    const toke = this.localStoreServices.GetLocalStorage();

    if (toke !== null) {
      this.token = toke;
    } else {
      this.errorServices.Redirecionar();
    }

    
    this.usuarioServices.detalhar(this.token, id)
      .pipe(
        first(),
        tap(result => {
          this.id = result.dados.id;
          this.nome = result.dados.nome;
          this.email = result.dados.email;
          this.cpf = result.dados.cpf;
          this.tribo = result.dados.tribo;
          this.contrato = result.dados.contrato;
          this.userName = result.dados.userName;
        }),
        catchError((error: HttpErrorResponse) => {
          this.errorServices.Errors(error);
          return of(null);
        }))
      .subscribe();
  }


  onPageChange(event: number) {

    const toke = this.localStoreServices.GetLocalStorage();

    if (toke !== null) {
      this.token = toke;
    } else {
      this.errorServices.Redirecionar();
    }

    this.usuarioServices.Lista(event, this.token)
      .pipe(
        first(),
        tap(result => {
          this.usuarioLista = result.dados.dados;
          this.count = result.dados.count;
          this.pageNumber = result.dados.pageIndex;
        }),
        catchError((error: HttpErrorResponse) => {
          this.errorServices.Errors(error);
          return of(null);
        }))
      .subscribe();
  }

  Atualizar() {

  }
}
