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
import { ActivatedRoute, Router } from '@angular/router';
import { sexoEnum } from '../../enums/sexoEnum';
import { estadoCivil } from '../../enums/estadoCivil';
import { ErrorsService } from '../errors/errors.service';

@Component({
  selector: 'app-ficha-conectado',
  templateUrl: './ficha-conectado.component.html',
  styleUrl: './ficha-conectado.component.css'
})
export class FichaConectadoComponent {
  istriboSelect: TriboSelected[] = [];
  isSexoSelect: Sexo[] = [
    { id: sexoEnum.Masculino, nome: 'Masculino' },
    { id: sexoEnum.Feminino, nome: 'Feminino' },
  ];
  isEstadoCivilSelect: EstadoCivil[] = [
    { id: estadoCivil.Solteiro, nome: 'Solteiro(a)' },
    { id: estadoCivil.Casado, nome: 'Casado(a)' },
    { id: estadoCivil.Divorciado, nome: 'Divorciado(a)' },
    { id: estadoCivil.Viuvo, nome: 'Viúvo(a)' },
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
    , private adapter: DateAdapter<any>, private siaoService: SiaoService, private route: ActivatedRoute
    , private router: Router, private errorServices: ErrorsService,) {
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

    this.evento = history.state.evento;

    const tokenEvento = history.state.token;

    this.idEvento = this.evento.id;

    this.triboServices.ListaSelected(tokenEvento)
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

  }

  receberDadosDoFilho(dados: number) {
    this.idEvento = dados;
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
            this.errorServices.Errors(error);
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
              this.CarregarForm();
            }),
            catchError((error: HttpErrorResponse) => {
              this.errorServices.Errors(error);
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

  private CarregarForm() {
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
  }
}
