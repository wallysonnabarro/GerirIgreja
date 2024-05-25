import { Injectable } from '@angular/core';
import { GlobalMenus } from './GlobalMenus';
import { Transacao } from '../perfil/transacao';
import { LocalStorageServiceService } from '../storage/local-storage-service.service';
import { ErrorsService } from '../components/errors/errors.service';
import { JwtServiceService } from '../jwt/jwt-service.service';
import { HttpErrorResponse } from '@angular/common/http';
import { first, tap, catchError, of } from 'rxjs';
import { PerfisService } from '../perfil/perfis.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { LoginServicesService } from '../components/login/login-services.service';

@Injectable({
  providedIn: 'root'
})
export class ProvedormenuService {
  menus: GlobalMenus[] = [];

  constructor(private errorServices: ErrorsService, private localStoreServices: LocalStorageServiceService,
    private jwtService: JwtServiceService, private perfis: PerfisService, private router: Router,
    private dialog: MatDialog, private loginServices: LoginServicesService
  ) {

    const toke = this.localStoreServices.GetLocalStorage();

    if (toke !== null) {

      this.menus.push({ status: true, nome: "Tribos/Equipes" });
      this.menus.push({ status: true, nome: "Membros" });
      this.menus.push({ status: true, nome: "Cadastro Sião" });
      this.menus.push({ status: true, nome: "Sião" });
      this.menus.push({ status: true, nome: "Área" });
      this.menus.push({ status: true, nome: "Inscricões" });
      this.menus.push({ status: true, nome: "Inscrições Voluntários" });
      this.menus.push({ status: true, nome: "Administração" });
      this.menus.push({ status: true, nome: "Novo Usuário" });
      this.menus.push({ status: true, nome: "Redefinir Senha" });
      this.menus.push({ status: true, nome: "Redefinir Acesso" });
      this.menus.push({ status: true, nome: "Fechamento/Pagamentos" });
      this.menus.push({ status: true, nome: "Fechamento - Sião" });
      this.menus.push({ status: true, nome: "Saída - Pagamentos" });
      this.menus.push({ status: true, nome: "Descontos - Pagamentos" });
      this.menus.push({ status: true, nome: "Fornecedor - Pagamentos" });
      this.menus.push({ status: true, nome: "Pendências - Pagamentos" });
      this.menus.push({ status: true, nome: "Ofertas - Sião" });
      this.menus.push({ status: true, nome: "Lançamentos Lanchonete" });
      this.menus.push({ status: true, nome: "Financeiro" });
      this.menus.push({ status: true, nome: "Registrar Financeiro" });
      this.menus.push({ status: true, nome: "Despesas e Obrigações" });
      this.menus.push({ status: true, nome: "Visualizar Financeiro" })
      this.menus.push({ status: true, nome: "Tipos de Saída" });
      this.menus.push({ status: true, nome: "Logout" });
      this.menus.push({ status: true, nome: "Login" });
      this.menus.push({ status: true, nome: "Configuracões" });
      this.menus.push({ status: true, nome: "Configurar tipos saída" });
      this.menus.push({ status: true, nome: "Desenvolvimento" });

      const jwt = this.jwtService.decodeJwtstring(toke);

      //Próximos passos
      //1º: Enviar para o end-point a permissão e buscar as transações.
      this.perfis.getPerfis(toke, jwt.role)
        .pipe(
          first(),
          tap(resultRole => {
            //2º: Fazer com que seja apresentado somente os menus e submenus de acordo com as transações.
            if (resultRole.succeeded) {
              this.forEachTransacao(resultRole.dados.transacoes);
              
              this.loginServices.setUserAuthenticado(true);
            }
          }),
          catchError((error: HttpErrorResponse) => {
            return of(null);
          })
        ).subscribe();
    } else {
      this.menus.push({ status: false, nome: "Tribos/Equipes" });
      this.menus.push({ status: false, nome: "Membros" });
      this.menus.push({ status: false, nome: "Cadastro Sião" });
      this.menus.push({ status: false, nome: "Sião" });
      this.menus.push({ status: false, nome: "Área" });
      this.menus.push({ status: false, nome: "Inscricões" });
      this.menus.push({ status: false, nome: "Inscrições Voluntários" });
      this.menus.push({ status: false, nome: "Administração" });
      this.menus.push({ status: false, nome: "Novo Usuário" });
      this.menus.push({ status: false, nome: "Redefinir Senha" });
      this.menus.push({ status: false, nome: "Redefinir Acesso" });
      this.menus.push({ status: false, nome: "Fechamento/Pagamentos" });
      this.menus.push({ status: false, nome: "Fechamento - Sião" });
      this.menus.push({ status: false, nome: "Saída - Pagamentos" });
      this.menus.push({ status: false, nome: "Descontos - Pagamentos" });
      this.menus.push({ status: false, nome: "Fornecedor - Pagamentos" });
      this.menus.push({ status: false, nome: "Pendências - Pagamentos" });
      this.menus.push({ status: false, nome: "Ofertas - Sião" });
      this.menus.push({ status: false, nome: "Lançamentos Lanchonete" });
      this.menus.push({ status: false, nome: "Financeiro" });
      this.menus.push({ status: false, nome: "Registrar Financeiro" });
      this.menus.push({ status: false, nome: "Despesas e Obrigações" });
      this.menus.push({ status: false, nome: "Visualizar Financeiro" })
      this.menus.push({ status: false, nome: "Tipos de Saída" });
      this.menus.push({ status: false, nome: "Logout" });
      this.menus.push({ status: true, nome: "Login" });
      this.menus.push({ status: true, nome: "Configuracões" });
      this.menus.push({ status: true, nome: "Configurar tipos saída" });
      this.menus.push({ status: false, nome: "Desenvolvimento" });
    }
  }

  forEachTransacao(transacoes: Transacao[]): void {
    transacoes.forEach(transacao => {
      const menu = this.menus.find(menu => menu.nome === transacao.nome);
      if (menu) {
        menu.status = true;
      }
    });

    this.menus.find(menu => menu.nome === 'Login')!.status = false;
    this.menus.find(menu => menu.nome === 'Logout')!.status = true;
  }

  LogoutTransacoes() {
    this.menus.forEach(menu => {
      menu.status = false;
      if (menu.nome === 'Login') {
        menu.status = true;
      }
    })
  }
}
