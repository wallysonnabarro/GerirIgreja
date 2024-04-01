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

  constructor(private loginServices: LoginServicesService, private fb: FormBuilder, private jwtService: JwtServiceService,
    private perfis: PerfisService, private menus: ProvedormenuService, private router: Router) {
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
      this.errorMessage = 'Você deve inserir uma senha';
    }
  }

  fazerLogin() {

    if (this.loginForm.valid) {
      const { email, senha } = this.loginForm.value;
      const login: Login = { Email: email, Senha: senha };

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
                        //adicionar um modal aqui
                      }
                    }),
                    catchError((error: HttpErrorResponse) => {
                      return of(null);
                    })
                  ).subscribe();
              }
            } else {
              //adicionar um modal aqui
            }
          }),
          catchError((error: HttpErrorResponse) => {
            return of(null);
          })
        ).subscribe();
    } else {
      //adicionar um modal aqui
    }
  }
}
