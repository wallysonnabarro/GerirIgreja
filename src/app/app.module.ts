import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { LayoutModule } from '@angular/cdk/layout';
import { MatIconModule } from '@angular/material/icon';
import { HttpClientXsrfModule, HttpClientModule } from '@angular/common/http';
import { LoginServicesService } from './components/login/login-services.service';
import { ProvedormenuService } from './provedorMenu/provedormenu.service';
import { TribosComponent } from './components/tribos/tribos.component';
import { LogoutComponent } from './components/logout/logout.component';
import { DialogComponent } from './components/dialog/dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NgxPaginationModule } from 'ngx-pagination';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import { SiaoComponent } from './components/siao/siao.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DATE_FORMATS, provideNativeDateAdapter } from '@angular/material/core';
import { AreasComponent } from './components/areas/areas.component';
import { FichaConectadoComponent } from './components/ficha-conectado/ficha-conectado.component';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { DialogEventoComponent } from './components/dialog-evento/dialog-evento.component';
import { FichaVoluntarioComponent } from './components/ficha-voluntario/ficha-voluntario.component';
import { SobreComponent } from './components/sobre/sobre.component';
import { PagamentosComponent } from './components/pagamentos/pagamentos.component';
import { ConfirmarDialogComponent } from './components/confirmar-dialog/confirmar-dialog.component';
import { CURRENCY_MASK_CONFIG, CurrencyMaskModule } from "ng2-currency-mask";
import { CustomCurrencyMaskConfig } from './pipes/CustomCurrencyMaskConfig';
import { DialogInteracaoComponent } from './components/dialog-interacao/dialog-interacao.component';
import { DialogTransferirComponent } from './components/dialog-transferir/dialog-transferir.component';
import { TokenDialogComponent } from './components/token-dialog/token-dialog.component';
import { AtualizarDialogComponent } from './components/atualizar-dialog/atualizar-dialog.component';
import { CheckInComponent } from './components/relatorios/checkin/check-in/check-in.component';
import { ConectadosComponent } from './components/relatorios/checkin/conectados/conectados.component';
import { ConfiguracoesComponent } from './components/configuracoes/configuracoes/configuracoes.component';
import { DialogImagemComponent } from './components/dialog-imagem/dialog-imagem.component';
import { FechamentoGeralComponent } from './components/pagamentos/fechamentos/fechamento-geral/fechamento-geral.component';
import { SaidasComponent } from './components/pagamentos/fechamentos/saidas/saidas.component';
import { TiposSaidasComponent } from './components/configuracoes/configuracoes/tipos-saidas/tipos-saidas.component';
import { FichapagamentosvoluntariosComponent } from './components/pagamentos/fichapagamentosvoluntarios/fichapagamentosvoluntarios.component';
import { NgApexchartsModule } from "ng-apexcharts";
import { OfertaComponent } from './components/pagamentos/oferta/oferta.component';
import { LanchoneteComponent } from './components/pagamentos/lanchonete/lanchonete.component';
import { PerfilComponent } from './components/perfil/perfil.component';
import {MatExpansionModule} from '@angular/material/expansion';
import { UsuarioComponent } from './components/usuario/usuario.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    LoginComponent,
    HomeComponent,
    TribosComponent,
    LogoutComponent,
    DialogComponent,
    SiaoComponent,
    AreasComponent,
    FichaConectadoComponent,
    DialogEventoComponent,
    FichaVoluntarioComponent,
    SobreComponent,
    PagamentosComponent,
    ConfirmarDialogComponent,
    DialogInteracaoComponent,
    DialogTransferirComponent,
    TokenDialogComponent,
    AtualizarDialogComponent,
    CheckInComponent,
    ConectadosComponent,
    ConfiguracoesComponent,
    DialogImagemComponent,
    FechamentoGeralComponent,
    SaidasComponent,
    TiposSaidasComponent,
    FichapagamentosvoluntariosComponent,
    OfertaComponent,
    LanchoneteComponent,
    PerfilComponent,
    UsuarioComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatSlideToggleModule,
    MatButtonModule,
    MatCardModule,
    MatToolbarModule,
    MatMenuModule,
    LayoutModule,
    MatIconModule,
    HttpClientModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    NgxPaginationModule,
    MatDividerModule,
    MatListModule,
    MatSelectModule,
    MatDatepickerModule,
    MatExpansionModule,
    FormsModule,
    NgxMaskDirective,
    MatCheckboxModule,
    MatRadioModule,
    CurrencyMaskModule,
    NgApexchartsModule,
    HttpClientXsrfModule.withOptions({
      cookieName: 'XSRF-TOKEN',
      headerName: 'X-XSRF-TOKEN',
    }),
  ],
  providers: [
    LoginServicesService,
    ProvedormenuService,
    provideNativeDateAdapter(),
    provideAnimationsAsync(),
    provideNgxMask(),
    {
      provide: MAT_DATE_FORMATS,
      useValue: {
        parse: {
          dateInput: ['l', 'LL'],
        },
        display: {
          dateInput: 'L',
          monthYearLabel: 'MMM YYYY',
          dateA11yLabel: 'LL',
          monthYearA11yLabel: 'MMMM YYYY',
        },
      },
    },
    { provide: CURRENCY_MASK_CONFIG, useValue: CustomCurrencyMaskConfig }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
