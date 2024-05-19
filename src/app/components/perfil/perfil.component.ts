import { Component } from '@angular/core';
import { ContratoSelected } from '../../interfaces/ContratoSelected';
import { selector } from '../../interfaces/seletor';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { LocalStorageServiceService } from '../../storage/local-storage-service.service';
import { ErrorsService } from '../errors/errors.service';
import { catchError, first, of, tap } from 'rxjs';
import { Perfil } from './Perfil';
import { HttpErrorResponse } from '@angular/common/http';
import { ContratoservicesService } from '../../services/contrato/contratoservices.service';
import { DialogComponent } from '../dialog/dialog.component';
import { NovoPerfil } from './NovoPerfil';
import { PerfilServicesService } from './perfil-services.service';
import { PerfilTransacoes } from './PerfilTransacoes';
import { Transacoes } from './Transacoes';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.css'
})
export class PerfilComponent {
 
  contratos: ContratoSelected[] = [];
  perfilTransacoes: PerfilTransacoes[] = [];
  statusLista: selector[] = [
    { id: 1, nome: 'Ativo' },
    { id: 0, nome: 'Bloqueado' },
  ];
  transacoes: Transacoes[] = [];

  contratoId = 0;
  statusId = 0;
  form: FormGroup;
  formEditar: FormGroup;
  token = "";
  searchText: string = '';
  pageNumber: number = 1;
  count: number = 0;
  PerfilArray: Perfil[] = [];
  isDetalhar = false;
  isAtualizar = false;
  panelOpenState = false;

  //detalhes
  Nome = "";
  status = "";

  //Editar
  tribosEquipes = false;
  membros = false;
  cadastroEvento = false;
  eventosSele = false;
  area = false;
  inscricoes = false;
  inscricoesVoluntarios = false;
  administracoe = false;
  novoUsuario = false;
  redefinirSenha = false;
  redefinirAcesso = false;
  fechamentoPagamentos = false;
  fechamentoEvento = false;
  SaidaPagamentos = false;
  ofertasEvento = false;
  lanchonete = false;
  financeiro = false;
  registrarFinanceiro = false;
  despesasObrigações = false;
  visualizarFinanceiro = false;
  tiposSaida = false;
  logout = false;
  login = false;
  id = 0;

  constructor(private fb: FormBuilder, private dialog: MatDialog, private localStoreServices: LocalStorageServiceService,
    private errorServices: ErrorsService, private contratoServices: ContratoservicesService, private perfilService: PerfilServicesService
  ) {
    this.form = this.fb.group({
      perfilName: ['', [Validators.required]],
      contratoSelecionadoId: [0, [Validators.required]],
      statusSelecionadoId: [0, [Validators.required]],
      tribosEquipes: false,
      membros: false,
      cadastroEvento: false,
      eventosSele: false,
      area: false,
      inscricoes: false,
      inscricoesVoluntarios: false,
      administracoe: false,
      novoUsuario: false,
      redefinirSenha: false,
      redefinirAcesso: false,
      fechamentoPagamentos: false,
      fechamentoEvento: false,
      SaidaPagamentos: false,
      ofertasEvento: false,
      lanchonete: false,
      financeiro: false,
      registrarFinanceiro: false,
      despesasObrigações: false,
      visualizarFinanceiro: false,
      tiposSaida: false,
      logout: false,
      login: false,
    });

    this.formEditar = this.fb.group({
      perfilName: ['', [Validators.required]],
      contratoSelecionadoId: [0, [Validators.required]],
      statusSelecionadoId: [0, [Validators.required]],
      tribosEquipes: false,
      membros: false,
      cadastroEvento: false,
      eventosSele: false,
      area: false,
      inscricoes: false,
      inscricoesVoluntarios: false,
      administracoe: false,
      novoUsuario: false,
      redefinirSenha: false,
      redefinirAcesso: false,
      fechamentoPagamentos: false,
      fechamentoEvento: false,
      SaidaPagamentos: false,
      ofertasEvento: false,
      lanchonete: false,
      financeiro: false,
      registrarFinanceiro: false,
      despesasObrigações: false,
      visualizarFinanceiro: false,
      tiposSaida: false,
      logout: false,
      login: false,
    });

    const toke = this.localStoreServices.GetLocalStorage();

    if (toke !== null) {
      this.token = toke;
    } else {
      this.errorServices.Redirecionar();
    }

    this.contratoServices.getContratosAtivos(this.token)
      .pipe(
        first(),
        tap(result => {
          this.contratos = result.dados;
        }),
        catchError((error: HttpErrorResponse) => {
          this.errorServices.Errors(error);
          return of(null);
        }))
      .subscribe();

    this.perfilService.Lista(1, this.token)
      .pipe(
        first(),
        tap(result => {
          this.perfilTransacoes = result.dados.dados;
          this.count = result.dados.count;
          this.pageNumber = result.dados.pageIndex;
        }),
        catchError((error: HttpErrorResponse) => {
          this.errorServices.Errors(error);
          return of(null);
        }))
      .subscribe();
  }

  contratoSelecionado() {
    const { contratoSelecionadoId } = this.form.value;
    this.contratoId = contratoSelecionadoId;
  }

  statusSelecionado() {
    const { statusSelecionadoId } = this.form.value;
    this.statusId = statusSelecionadoId;
  }

  novo() {
    const { perfilName, contratoSelecionadoId, statusSelecionadoId, tribosEquipes, membros, cadastroEvento, eventosSele, area, inscricoes, inscricoesVoluntarios, administracoe, novoUsuario, redefinirSenha, redefinirAcesso, fechamentoPagamentos, fechamentoEvento, SaidaPagamentos, ofertasEvento, lanchonete, financeiro, registrarFinanceiro, despesasObrigações, visualizarFinanceiro, tiposSaida, logout, login } = this.form.value;
    if (this.contratoId === 0) {
      this.openDialog("Selecione um contrato.");
    } else if (this.statusId === 0) {
      this.openDialog("Selecione um status.");
    } else if (perfilName === "") {
      this.openDialog("Selecione um perfil.");
    } else {
      var perfilNovo: NovoPerfil = {
        administracoe: administracoe,
        area: area,
        cadastroEvento: cadastroEvento,
        contratoSelecionadoId: contratoSelecionadoId,
        despesasObrigações: despesasObrigações,
        eventosSele: eventosSele,
        fechamentoEvento: fechamentoEvento,
        fechamentoPagamentos: fechamentoPagamentos,
        financeiro: financeiro,
        inscricoes: inscricoes,
        inscricoesVoluntarios: inscricoesVoluntarios,
        lanchonete: lanchonete,
        membros: membros,
        novoUsuario: novoUsuario,
        ofertasEvento: ofertasEvento,
        perfilName: perfilName,
        redefinirAcesso: redefinirAcesso,
        redefinirSenha: redefinirSenha,
        registrarFinanceiro: registrarFinanceiro,
        SaidaPagamentos: SaidaPagamentos,
        statusSelecionadoId: statusSelecionadoId,
        tiposSaida: tiposSaida,
        tribosEquipes: tribosEquipes,
        visualizarFinanceiro: visualizarFinanceiro,
        logout: logout,
        login: login
      };

      this.perfilService.postNovoPerfil(this.token, perfilNovo)
        .pipe(
          first(),
          tap(result => {
            this.form.reset();
            this.openDialog("Registrado com sucesso.");
          }),
          catchError((error: HttpErrorResponse) => {
            this.errorServices.Errors(error);
            return of(null);
          })
        )
        .subscribe();
    }
  }

  get filteredPerfilArray() {
    if (!this.searchText.trim()) {
      return this.perfilTransacoes;
    }

    return this.perfilTransacoes.filter(item =>
      item.nome.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }


  Editar(id: number) {    
    this.isDetalhar = false;
    this.isAtualizar = true;

    this.id = id;
    const trans = this.perfilTransacoes.find(p => p.id === id);
    if (trans?.transacoes !== null) {
      this.transacoes = trans?.transacoes == null ? [] : trans.transacoes;
      this.Nome = trans?.nome == null ? "" : trans.nome;
      this.status = trans?.status === null ? "Bloqueado" : trans?.status === 0 ? "Bloquado" : "Ativo";
      this.statusId = trans?.status === null ? 0:  trans?.status === 0 ? 0 : 1;

      this.transacoes.forEach(element => {
        const item = element.nome;
        if(item == "Tribos/Equipes") this.tribosEquipes = true;
        if(item == "Membros") this.membros = true;
        if(item == "Cadastro Sião") this.cadastroEvento = true;
        if(item == "Sião") this.eventosSele = true;
        if(item == "Área") this.area = true;
        if(item == "Inscricões") this.inscricoes = true;
        if(item == "Inscrições Voluntários") this.inscricoesVoluntarios = true;
        if(item == "Administração") this.administracoe = true;
        if(item == "Novo Usuário") this.novoUsuario = true;
        if(item == "Redefinir Senha") this.redefinirSenha = true;
        if(item == "Redefinir Acesso") this.redefinirAcesso = true;
        if(item == "Fechamento/Pagamentos") this.fechamentoPagamentos = true;
        if(item == "Fechamento - Sião") this.fechamentoEvento = true;
        if(item == "Saída - Pagamentos") this.SaidaPagamentos = true;
        if(item == "Ofertas - Sião") this.ofertasEvento = true;
        if(item == "Lançamentos Lanchonete") this.lanchonete = true;
        if(item == "Financeiro") this.financeiro = true;
        if(item == "Registrar Financeiro") this.registrarFinanceiro = true;
        if(item == "Despesas e Obrigações") this.despesasObrigações = true;
        if(item == "Visualizar Financeiro") this.visualizarFinanceiro = true;
        if(item == "Tipos de Saída") this.tiposSaida = true;
        if(item == "Logout") this.logout = true;
        if(item == "Login") this.login = true;
      });      
      
      this.formEditar.patchValue({
        perfilName: trans?.nome == null ? "" : trans.nome,
        tribosEquipes: this.tribosEquipes,
        membros: this.membros,
        cadastroEvento: this.cadastroEvento,
        eventosSele: this.eventosSele,
        area: this.area,
        inscricoes: this.inscricoes,
        inscricoesVoluntarios: this.inscricoesVoluntarios,
        administracoe: this.administracoe,
        novoUsuario: this.novoUsuario,
        redefinirSenha: this.redefinirSenha,
        redefinirAcesso: this.redefinirAcesso,
        fechamentoPagamentos: this.fechamentoPagamentos,
        fechamentoEvento: this.fechamentoEvento,
        SaidaPagamentos: this.SaidaPagamentos,
        ofertasEvento: this.ofertasEvento,
        lanchonete: this.lanchonete,
        financeiro: this.financeiro,
        registrarFinanceiro: this.registrarFinanceiro,
        despesasObrigações: this.despesasObrigações,
        visualizarFinanceiro: this.visualizarFinanceiro,
        tiposSaida: this.tiposSaida,
        logout: this.logout,
        login: this.login
      });
      this.formEditar.get('statusSelecionadoId')!.setValue(trans?.status);
    } else {
      this.openDialog("Erro ao buscar o perfil.");
    }
  }

  Detalhar(id: number) {
    this.isDetalhar = true;
    this.isAtualizar = false;

    const trans = this.perfilTransacoes.find(p => p.id === id);
    if (trans?.transacoes !== null) {
      this.transacoes = trans?.transacoes == null ? [] : trans.transacoes;
      this.Nome = trans?.nome == null ? "" : trans.nome;
      this.status = trans?.status === null ? "Bloqueado" : trans?.status === 0 ? "Bloquado" : "Ativo";
    } else {
      this.openDialog("Erro ao buscar o perfil.");
    }
  }


  onPageChange(event: number) {
    
    const toke = this.localStoreServices.GetLocalStorage();

    if (toke !== null) {
      this.token = toke;
    } else {
      this.errorServices.Redirecionar();
    }

    this.perfilService.Lista(event, this.token)
      .pipe(
        first(),
        tap(result => {
          this.perfilTransacoes = result.dados.dados;
          this.count = result.dados.count;
          this.pageNumber = result.dados.pageIndex;
        }),
        catchError((error: HttpErrorResponse) => {
          this.errorServices.Errors(error);
          return of(null);
        }))
      .subscribe();
  }

  Atualizar() {
    const { perfilName, contratoSelecionadoId, statusSelecionadoId, tribosEquipes, membros, cadastroEvento, eventosSele, area, inscricoes, inscricoesVoluntarios, administracoe, novoUsuario, redefinirSenha, redefinirAcesso, fechamentoPagamentos, fechamentoEvento, SaidaPagamentos, ofertasEvento, lanchonete, financeiro, registrarFinanceiro, despesasObrigações, visualizarFinanceiro, tiposSaida, logout, login } = this.formEditar.value;
    
    if (this.statusId === 0) {
      this.openDialog("Selecione um status.");
    } else if (perfilName === "") {
      this.openDialog("Selecione um perfil.");
    } else {
      var perfilNovo: Perfil = {
        id: this.id,
        administracoe: administracoe,
        area: area,
        cadastroEvento: cadastroEvento,
        contratoSelecionadoId: contratoSelecionadoId,
        despesasObrigações: despesasObrigações,
        eventosSele: eventosSele,
        fechamentoEvento: fechamentoEvento,
        fechamentoPagamentos: fechamentoPagamentos,
        financeiro: financeiro,
        inscricoes: inscricoes,
        inscricoesVoluntarios: inscricoesVoluntarios,
        lanchonete: lanchonete,
        membros: membros,
        novoUsuario: novoUsuario,
        ofertasEvento: ofertasEvento,
        perfilName: perfilName,
        redefinirAcesso: redefinirAcesso,
        redefinirSenha: redefinirSenha,
        registrarFinanceiro: registrarFinanceiro,
        SaidaPagamentos: SaidaPagamentos,
        statusSelecionadoId: statusSelecionadoId,
        tiposSaida: tiposSaida,
        tribosEquipes: tribosEquipes,
        visualizarFinanceiro: visualizarFinanceiro,
        logout: logout,
        login: login
      };

      this.perfilService.postAtualizarPerfil(this.token, perfilNovo)
        .pipe(
          first(),
          tap(result => {            
            this.onPageChange(1);
            this.formEditar.reset();
            this.openDialog("Atualizado com sucesso.");
          }),
          catchError((error: HttpErrorResponse) => {
            this.errorServices.Errors(error);
            return of(null);
          })
        )
        .subscribe();
    }
  }

  openDialog(p: string): void {
    const dialogRef = this.dialog.open(DialogComponent, {
      data: { titulo: 'Perfil', paragrafo: p },
      width: '350px',
    });

    dialogRef.afterClosed().subscribe(result => {
    });
  }
}
