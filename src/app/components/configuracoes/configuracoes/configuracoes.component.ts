import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-configuracoes',
  templateUrl: './configuracoes.component.html',
  styleUrl: './configuracoes.component.css'
})
export class ConfiguracoesComponent {

  constructor(private router: Router) { }

  voluntario() {
    // this.router.navigate(['/configurar-voluntarios']);
  }

  conectados() {
    // this.router.navigate(['/configurar-conectados']);
  }
}
