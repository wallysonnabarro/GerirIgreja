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
import { ActivatedRoute, Router } from '@angular/router';
import { sexoEnum } from '../../enums/sexoEnum';
import { ErrorsService } from '../errors/errors.service';

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
    { id: sexoEnum.Masculino, nome: 'Masculino' },
    { id: sexoEnum.Feminino, nome: 'Feminino' },
  ];

  constructor(private fb: FormBuilder, private triboServices: TribosService, private dialog: MatDialog, private fichaService: FichaConectadoService
    , private siaoService: SiaoService, private areasServices: AreasService, private route: ActivatedRoute, private router: Router,
    private errorServices: ErrorsService) {

    this.form = this.fb.group({
      tribo: [0, [Validators.required]],
      nome: ['', [Validators.required]],
      area: [0, [Validators.required]],
      sexo: [0, [Validators.required]],
    });

    this.evento = history.state.evento;

    const tokenEvento = history.state.token;

    this.idEvento = this.evento.id;

    this.areasServices.getAreas(tokenEvento)
      .pipe(
        first(),
        tap(result => {
            this.isAreasSelect = result.dados;
        }),
        catchError((error: HttpErrorResponse) => {
          this.errorServices.Errors(error);
          return of(null);
        })
      )
      .subscribe();

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

  openDialog(p: string): void {
    const dialogRef = this.dialog.open(DialogComponent, {
      data: { titulo: 'Login', paragrafo: p },
      width: '350px',
    });

    dialogRef.afterClosed().subscribe(result => {
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
              this.openDialog("Registrado com sucesso.");
              this.form.reset();
              this.CarregarForm();
          }),
          catchError((error: HttpErrorResponse) => {
            this.errorServices.Errors(error);
            return of(null);
          })
        )
        .subscribe();
    } else {
      this.openDialog("Preenchas os campos.");
    }
  }

  private CarregarForm() {
    this.form = this.fb.group({
      tribo: [0, [Validators.required]],
      nome: ['', [Validators.required]],
      area: [0, [Validators.required]],
      sexo: [0, [Validators.required]],
    });
  }
}
