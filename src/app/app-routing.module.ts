import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { TribosComponent } from './components/tribos/tribos.component';
import { CanActivate } from './guard/auth.guard';
import { LogoutComponent } from './components/logout/logout.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'tribo-equipes', component: TribosComponent, canActivate: [CanActivate] },
  { path: 'logout', component: LogoutComponent, canActivate: [CanActivate] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
