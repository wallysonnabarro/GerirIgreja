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
    private perfis: PerfisService, private menus: ProvedormenuService, private router: Router, private dialog: MatDialog) {
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
                        if (resultRole.transacoes !== null) {
                          this.menus.forEachTransacao(resultRole.transacoes);

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
              let errorMessage = "";

              if (error.status === 403) {
                errorMessage = 'Acesso negado.';
              } else if (error.status === 401) {
                errorMessage = 'Não autorizado.';
              } else if (error.status === 500) {
                errorMessage = 'Erro interno do servidor.';
              } else if (error.status === 0) {
                errorMessage = 'Erro de conexão: O servidor não está ativo ou não responde.';
              } else if (error.message && error.message.includes('ERR_CONNECTION_REFUSED')) {
                errorMessage = 'Erro de conexão: O servidor recusou a conexão.';
              }

              this.openDialog(errorMessage);
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
