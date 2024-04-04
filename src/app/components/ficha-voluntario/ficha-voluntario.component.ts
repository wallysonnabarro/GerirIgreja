import { Component } from '@angular/core';
import { Eventos } from '../../interfaces/Eventos';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { FichaConectadoService } from '../ficha-conectado/ficha-conectado.service';
import { SiaoService } from '../siao/siao.service';
import { TribosService } from '../tribos/tribos.service';
import { DialogDataEvento } from '../dialog-evento/DialogDataEvento';
import { DialogEventoComponent } from '../dialog-evento/dialog-evento.component';
import { HttpErrorResponse } from '@angular/common/http';
import { first, tap, catchError, of } from 'rxjs';
import { DialogComponent } from '../dialog/dialog.component';
import { TriboSelected } from '../../interfaces/TriboSelected';
import { Areas } from '../../interfaces/Areas';
import { AreasService } from '../areas/areas.service';
import { Sexo } from '../../interfaces/Sexo';
import { FichaLider } from '../../interfaces/FichaLider';

@Component({
  selector: 'app-ficha-voluntario',
  templateUrl: './ficha-voluntario.component.html',
  styleUrl: './ficha-voluntario.component.css'
})
export class FichaVoluntarioComponent {

  evento: Eventos = { id: 0, nome: "" };
  form: FormGroup;
  EventDialog: DialogDataEvento = { evento: [], paragrafo: "", titulo: "" };
  eventos: Eventos[] = [];
  idEvento = 0;
  istriboSelect: TriboSelected[] = [];
  isAreasSelect: Areas[] = [];
  isSexoSelect: Sexo[] = [
    { id: 1, nome: 'Masculino' },
    { id: 2, nome: 'Feminino' },
  ];

  constructor(private fb: FormBuilder, private triboServices: TribosService, private dialog: MatDialog, private fichaService: FichaConectadoService
    , private siaoService: SiaoService, private areasServices: AreasService) {

    this.form = this.fb.group({
      tribo: [0, [Validators.required]],
      nome: ['', [Validators.required]],
      area: [0, [Validators.required]],
      sexo: [0, [Validators.required]],
    });

    this.areasServices.getAreas()
      .pipe(
        first(),
        tap(result => {
          if (result.dados.length > 0 && result.succeeded) {
            this.isAreasSelect = result.dados;
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

  aqui() {
    this.openDialogDoEvento(this.EventDialog);
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

  novo() {
    if (this.form.valid) {
      const { tribo, nome, area, sexo } = this.form.value;

      var novo: FichaLider = { area: area, nome: nome, sexo: sexo, tribo: tribo, siao: this.idEvento };

      this.fichaService.postFichaLider(novo)
        .pipe(
          first(),
          tap(result => {
            if (result.dados !== false && result.succeeded) {
              this.openDialog("Registrado com sucesso.");
              this.form.reset();
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
    } else {
      this.openDialog("Preenchas os campos.");
    }
  }
}
