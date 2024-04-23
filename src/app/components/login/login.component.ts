import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { catchError, first, of, tap } from 'rxjs';
import { LoginServicesService } from './login-services.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Login } from './login';
import { TokenResult } from '../../jwt/jwtService/token-result';
import { JwtServiceService } from '../../jwt/jwt-service.service';
import { PerfisService } from '../../perfil/perfis.service';
import { ProvedormenuService } from '../../provedorMenu/provedormenu.service';
import { Router } from '@angular/router';
import { DialogComponent } from '../dialog/dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { ErrorsService } from '../errors/errors.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginForm: FormGroup;
  hide = true;
  errorMessage = '';
  private jwt!: TokenResult;
  isLoading = false;

  constructor(private loginServices: LoginServicesService, private fb: FormBuilder, private jwtService: JwtServiceService,
    private perfis: PerfisService, private menus: ProvedormenuService, private router: Router, private dialog: MatDialog,
    private errorServices: ErrorsService) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      senha: ['', Validators.required]
    });
  }

  updateErrorMessage() {
    this.errorMessage = '';
    const email = this.loginForm.get('email');
    const senha = this.loginForm.get('senha');

    if (email?.invalid && (email.dirty)) {
      this.errorMessage = email.hasError('required') ? 'Você deve inserir um email' : 'Email inválido';
    } else if (senha?.invalid && (senha.dirty)) {
      this.errorMessage = 'Você deve inserir uma senha!';
    }
  }

  fazerLogin() {

    if (this.loginForm.valid) {

      const { email, senha } = this.loginForm.value;

      const login: Login = { Email: email, Senha: senha };

      this.isLoading = true;

      try {
        this.loginServices.Logar(login)
          .pipe(
            first(),
            tap(result => {
              if (result) {
                if (result.resultado.succeeded
                  && result.resultado.requeredEmailConfirm == false && result.resultado.isLockedOut == false
                  && result.resultado.isNotAllowed == false && result.resultado.requiresTwoFactor == false) {
                  this.jwt = this.jwtService.decodeJwt(result);

                  this.loginServices.setUserAuthenticado(true);

                  //Próximos passos
                  //1º: Enviar para o end-point a permissão e buscar as transações.
                  this.perfis.getPerfis(result.toke, this.jwt.role)
                    .pipe(
                      first(),
                      tap(resultRole => {
                        //2º: Fazer com que seja apresentado somente os menus e submenus de acordo com as transações.
                        if (resultRole.succeeded) {
                          this.menus.forEachTransacao(resultRole.dados.transacoes);

                          this.router.navigate(['/home']);
                        } else {
                          this.openDialog("O perfil não contém permissão válida");
                        }
                        this.isLoading = false;
                      }),
                      catchError((error: HttpErrorResponse) => {
                        this.isLoading = false;
                        return of(null);
                      })
                    ).subscribe();
                } else {
                  this.openDialog("Usuário ou senha inválido.");
                  this.isLoading = false;
                }
              } else {
                this.openDialog("Sem resultado.");
              }
            }),
            catchError((error: HttpErrorResponse) => {
              this.errorServices.Errors(error);
              
              this.isLoading = false;
              return of(null);
            })
          ).subscribe();
      } catch (error) {
        this.openDialog("Error: " + error);
        this.isLoading = false;
      }
    } else {
      this.openDialog("Preencha os campos corretamente.");
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

}
