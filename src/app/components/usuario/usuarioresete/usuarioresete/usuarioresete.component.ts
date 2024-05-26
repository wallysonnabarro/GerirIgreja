import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogData } from '../../../dialog/DialogData';
import { DialogComponent } from '../../../dialog/dialog.component';
import { Login } from '../../../login/login';
import { LoginServicesService } from '../../../login/login-services.service';
import { catchError, first, of, tap } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { ErrorsService } from '../../../errors/errors.service';

@Component({
  selector: 'app-usuarioresete',
  templateUrl: './usuarioresete.component.html',
  styleUrl: './usuarioresete.component.css'
})
export class UsuarioreseteComponent {
  form: FormGroup;
  hide = true;
  errorMessage = '';

  constructor(public dialogRef: MatDialogRef<UsuarioreseteComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData, private fb: FormBuilder, private dialog: MatDialog,
    private loginServices: LoginServicesService, private errorServices: ErrorsService
  ) {

    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      senha: ['', Validators.required]
    });
  }

  OK() {
    if (this.form.valid) {
      const { email, senha } = this.form.value;

      const login: Login = { Email: email, Senha: senha };

      this.loginServices.RedefinirSenha(login)
        .pipe(
          first(),
          tap(result => {
            if (result.succeeded) {
              this.openDialog("Sucesso.");
            } else {
              this.openDialog("Error." + result.errors[0].mensagem);
            }
          }),
          catchError((error: HttpErrorResponse) => {
            this.errorServices.Errors(error);

            return of(null);
          })
        )
        .subscribe();
    }
  }

  Fechar(): void {
    this.dialogRef.close({});
  }

  openDialog(p: string): void {
    const dialogRef = this.dialog.open(DialogComponent, {
      data: { titulo: 'Resete', paragrafo: p },
      width: '350px',
    });

    dialogRef.afterClosed().subscribe(result => {
    });
  }

}
