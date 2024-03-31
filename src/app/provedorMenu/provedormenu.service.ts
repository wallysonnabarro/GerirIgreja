import { Injectable } from '@angular/core';
import { GlobalMenus } from './GlobalMenus';

@Injectable({
  providedIn: 'root'
})
export class ProvedormenuService {
  menus: GlobalMenus[] = [];

  constructor() { 
    this.menus.push({status: false, nome: "Tribos/Equipes"});
    this.menus.push({status: false, nome: "Membros"});
    this.menus.push({status: false, nome: "Cadastro Sião"});
    this.menus.push({status: false, nome: "Sião"});
    this.menus.push({status: false, nome: "Área"});
    this.menus.push({status: false, nome: "Inscricões"});
    this.menus.push({status: false, nome: "Inscrições Líderes"});
    this.menus.push({status: false, nome: "Administrativo"});
    this.menus.push({status: false, nome: "Novo Usuário"});
    this.menus.push({status: false, nome: "Redefinir Senha"});
    this.menus.push({status: false, nome: "Redefinir Acesso"});
    this.menus.push({status: false, nome: "Fechamento/Pagamentos"});
    this.menus.push({status: false, nome: "Fechamento - Sião"});
    this.menus.push({status: false, nome: "Saída - Pagamentos"});
    this.menus.push({status: false, nome: "Descontos - Pagamentos"});
    this.menus.push({status: false, nome: "Fornecedor - Pagamentos"});
    this.menus.push({status: false, nome: "Pendências - Pagamentos"});
    this.menus.push({status: false, nome: "Ofertas - Sião"});
    this.menus.push({status: false, nome: "Lançamentos Lanchonete"});
    this.menus.push({status: false, nome: "Financeiro"});
    this.menus.push({status: false, nome: "Registrar Financeiro"});
    this.menus.push({status: false, nome: "Despesas e Obrigações"});
    this.menus.push({status: false, nome: "Visualizar Financeiro"})
    this.menus.push({status: false, nome: "Tipos de Saída"});
    this.menus.push({status: false, nome: "Logout"});
    this.menus.push({status: true, nome: "Login"});

    
    this.menus.push({status: false, nome: "Desenvolvimento"});
  }


}
