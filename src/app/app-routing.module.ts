import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { TribosComponent } from './components/tribos/tribos.component';
import { CanActivate } from './guard/auth.guard';
import { LogoutComponent } from './components/logout/logout.component';
import { SiaoComponent } from './components/siao/siao.component';
import { AreasComponent } from './components/areas/areas.component';
import { FichaConectadoComponent } from './components/ficha-conectado/ficha-conectado.component';
import { FichaVoluntarioComponent } from './components/ficha-voluntario/ficha-voluntario.component';
import { SobreComponent } from './components/sobre/sobre.component';
import { PagamentosComponent } from './components/pagamentos/pagamentos.component';
import { ConfiguracoesComponent } from './components/configuracoes/configuracoes/configuracoes.component';
import { FechamentoGeralComponent } from './components/pagamentos/fechamentos/fechamento-geral/fechamento-geral.component';
import { SaidasComponent } from './components/pagamentos/fechamentos/saidas/saidas.component';
import { TiposSaidasComponent } from './components/configuracoes/configuracoes/tipos-saidas/tipos-saidas.component';
import { OfertaComponent } from './components/pagamentos/oferta/oferta.component';
import { LanchoneteComponent } from './components/pagamentos/lanchonete/lanchonete.component';
import { PerfilComponent } from './components/perfil/perfil.component';
import { UsuarioComponent } from './components/usuario/usuario.component';
import { AuthGuardCanActivate } from './guard/auth.guard.canActivate';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'conectado', component: FichaConectadoComponent },
  { path: 'voluntario', component: FichaVoluntarioComponent },
  { path: 'sobre', component: SobreComponent },
  { path: 'tribo-equipes', component: TribosComponent, canActivate: [AuthGuardCanActivate] },
  { path: 'logout', component: LogoutComponent, canActivate: [AuthGuardCanActivate] },
  { path: 'siao', component: SiaoComponent, canActivate: [AuthGuardCanActivate] },
  { path: 'areas-servico', component: AreasComponent, canActivate: [AuthGuardCanActivate] },
  { path: 'pagamento-inscricoes', component: PagamentosComponent, canActivate: [AuthGuardCanActivate] },
  { path: 'configuracoes', component: ConfiguracoesComponent, canActivate: [AuthGuardCanActivate] },
  { path: 'fechamentos', component: FechamentoGeralComponent, canActivate: [AuthGuardCanActivate] },
  { path: 'saidas', component: SaidasComponent, canActivate: [AuthGuardCanActivate] },
  { path: 'oferta-Siao', component: OfertaComponent, canActivate: [AuthGuardCanActivate] },
  { path: 'configurar-tipos-saida', component: TiposSaidasComponent, canActivate: [AuthGuardCanActivate] },
  { path: 'configurar-perfil', component: PerfilComponent, canActivate: [AuthGuardCanActivate] },
  { path: 'lanchonete', component: LanchoneteComponent, canActivate: [AuthGuardCanActivate] },
  { path: 'novo-usuario', component: UsuarioComponent, canActivate: [AuthGuardCanActivate] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
