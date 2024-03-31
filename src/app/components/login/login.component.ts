import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { catchError, first, of, tap } from 'rxjs';
import { LoginServicesService } from './login-services.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Login } from './login';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginForm: FormGroup;
  hide = true;
  errorMessage = '';

  constructor(private loginServices: LoginServicesService, private fb: FormBuilder) {
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
            if(result){              
              if (result.resultado.succeeded
                && result.resultado.requeredEmailConfirm == false && result.resultado.isLockedOut == false
                && result.resultado.isNotAllowed == false && result.resultado.requiresTwoFactor == false) {
                
              }
            }
          }),
          catchError((error: HttpErrorResponse) => {
            return of(null);
          })
        ).subscribe();
    } else {

    }
  }
}
