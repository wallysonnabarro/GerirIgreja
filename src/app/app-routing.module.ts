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

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'tribo-equipes', component: TribosComponent, canActivate: [CanActivate] },
  { path: 'logout', component: LogoutComponent, canActivate: [CanActivate] },
  { path: 'siao', component: SiaoComponent, canActivate: [CanActivate] },
  { path: 'areas-servico', component: AreasComponent, canActivate: [CanActivate] },
  { path: 'pagamento-inscricoes', component: PagamentosComponent, canActivate: [CanActivate] },
  { path: 'conectado', component: FichaConectadoComponent },
  { path: 'voluntario', component: FichaVoluntarioComponent },
  { path: 'sobre', component: SobreComponent },
  { path: 'configuracoes', component: ConfiguracoesComponent, canActivate: [CanActivate] },
  { path: 'fechamentos', component: FechamentoGeralComponent, canActivate: [CanActivate] },
  { path: 'saidas', component: SaidasComponent, canActivate: [CanActivate] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
