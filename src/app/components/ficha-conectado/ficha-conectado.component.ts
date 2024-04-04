import { Component } from '@angular/core';
import { TriboSelected } from '../../interfaces/TriboSelected';
import { TribosService } from '../tribos/tribos.service';
import { catchError, first, of, tap } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../dialog/dialog.component';
import { Sexo } from '../../interfaces/Sexo';
import { EstadoCivil } from '../../interfaces/EstadoCivil';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CepService } from '../../cepService/cep.service';
import { FichaConectadoService } from './ficha-conectado.service';
import { FichaConectado } from '../../interfaces/FichaConectados';
import { DateAdapter } from '@angular/material/core';
import moment from 'moment';
import { SiaoService } from '../siao/siao.service';
import { Eventos } from '../../interfaces/Eventos';
import { DialogDataEvento } from '../dialog-evento/DialogDataEvento';
import { DialogEventoComponent } from '../dialog-evento/dialog-evento.component';

@Component({
  selector: 'app-ficha-conectado',
  templateUrl: './ficha-conectado.component.html',
  styleUrl: './ficha-conectado.component.css'
})
export class FichaConectadoComponent {
  istriboSelect: TriboSelected[] = [];
  isSexoSelect: Sexo[] = [
    { id: 1, nome: 'Masculino' },
    { id: 2, nome: 'Feminino' },
  ];
  isEstadoCivilSelect: EstadoCivil[] = [
    { id: 1, nome: 'Solteiro(a)' },
    { id: 2, nome: 'Casado(a)' },
    { id: 3, nome: 'Divorciado(a)' },
    { id: 4, nome: 'Viúvo(a)' },
  ];
  form: FormGroup;
  Cep = "";
  Disabled = false;
  DisabledCuidados = false;
  eventos: Eventos[] = [];
  idEvento = 0;
  evento: Eventos = { id: 0, nome: "" };
  EventDialog: DialogDataEvento = { evento: [], paragrafo: "", titulo: "" };

  constructor(private fb: FormBuilder, private triboServices: TribosService, private dialog: MatDialog, private cepService: CepService
    , private fichaService: FichaConectadoService
    , private adapter: DateAdapter<any>, private siaoService: SiaoService) {
    this.adapter.setLocale('pt-br');

    this.form = this.fb.group({
      tribo: ['', [Validators.required]],
      lider: ['', [Validators.required]],
      cep: ['', [Validators.required]],
      endereco: ['', [Validators.required]],
      nome: ['', [Validators.required]],
      sexo: ['', [Validators.required]],
      estadoCivil: ['', [Validators.required]],
      nascimento: ['', [Validators.required]],
      telefone: ['', [Validators.required]],
      email: ['', [Validators.required]],
      contatoEmergencial: ['', [Validators.required]],
      crianca: [false],
      cuidados: [false],
      idade: [0],
      descricaoCuidados: [''],
    });

    this.triboServices.ListaSelected()
      .pipe(
        first(),
        tap(result => {
          if (result.dados.length > 0 && result.succeeded) {
            this.istriboSelect = result.dados;
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

    this.siaoService.getSiaoIniciado()
      .pipe(
        first(),
        tap(result => {
          if (result.dados.length > 0) {
            this.eventos = result.dados;
            this.EventDialog = {
              evento: result.dados,
              paragrafo: "Eventos ativos:",
              titulo: "Eventos"
            };

            this.openDialogDoEvento(this.EventDialog);
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

  receberDadosDoFilho(dados: number) {
    this.idEvento = dados;
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

  buscarCep() {
    const { cep } = this.form.value;

    if (cep !== "") {
      this.cepService.getCep(cep)
        .pipe(
          first(),
          tap(result => {
            this.form.patchValue({
              endereco: result.logradouro + ", " + result.bairro + ", " + result.localidade + " - " + result.uf
            });
          }),
          catchError((error: HttpErrorResponse) => {
            this.Errors(error.status);
            return of(null);
          })
        )
        .subscribe();
    } else {
      this.openDialog("Digite o CEP.");
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

  openDialogDoEvento(event: DialogDataEvento): void {
    const dialogRef = this.dialog.open(DialogEventoComponent, {
      data: event,
      width: '350px',
    });

    dialogRef.afterClosed().subscribe(result => {
      let id = result;
      const novo = this.eventos.find(s => s.id === result.id);
      if (novo) {
        const ed: Eventos = { id: novo.id, nome: novo.nome };
        this.evento = ed;
        this.idEvento = id;
      }
    });
  }

  aqui(){
    this.openDialogDoEvento(this.EventDialog);
  }

  checkCrianca() {
    this.Disabled = !this.Disabled;
  }

  checkCuidados() {
    this.DisabledCuidados = !this.DisabledCuidados;
  }

  novo() {
    if (this.idEvento !== 0) {

      if (this.form.valid) {

        let newDatenascimento: moment.Moment = moment.utc(this.form.value.nascimento).local();
        this.form.value.nascimento = newDatenascimento.format("YYYY-MM-DD");

        const { tribo, lider, cep, endereco, nome, sexo, estadoCivil, nascimento, telefone, email, contatoEmergencial, crianca, cuidados, idade, descricaoCuidados } = this.form.value;

        const ficha: FichaConectado = {
          Cep: cep,
          ContatoEmergencial: contatoEmergencial,
          Crianca: crianca,
          Cuidados: cuidados,
          DescricaoCuidados: descricaoCuidados,
          Email: email,
          Endereco: endereco,
          EstadoCivil: estadoCivil,
          Idade: idade,
          Lider: lider,
          Nascimento: nascimento,
          Nome: nome,
          Sexo: sexo,
          Telefone: telefone,
          Tribo: tribo,
          Siao: this.evento.id
        };

        this.fichaService.postFichaConectado(ficha)
          .pipe(
            first(),
            tap(result => {
              this.form.reset();
              this.openDialog("Registrado com sucesso.");
            }),
            catchError((error: HttpErrorResponse) => {
              this.Errors(error.status);
              return of(null);
            })
          )
          .subscribe();

      } else {
        this.openDialog("Preencha os campos obrigatórios.");
      }
    } else {
      this.openDialog("Não foi localizado evento ativo. Entre em contato com o responsável do evento.");
    }
  }
}
