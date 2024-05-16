import { AfterViewInit, Component, ElementRef, Inject, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import jsPDF from 'jspdf';
import { DataPagamentos } from './DataPagamentos';
import { ListPagamento } from '../../../interfaces/ListPagamento';

@Component({
  selector: 'app-fichapagamentosvoluntarios',
  templateUrl: './fichapagamentosvoluntarios.component.html',
  styleUrl: './fichapagamentosvoluntarios.component.css'
})
export class FichapagamentosvoluntariosComponent  implements AfterViewInit {

  @ViewChild('content', { static: false }) el!: ElementRef;
  totaldinheiro = 0;
  totaldebito = 0;
  totalcredVista = 0;
  totalcredParcelado = 0;
  totaltedPix = 0;
  totaldescontar = 0;
  totalreceber = 0;
  tituloTotal = "Total";
  todosElementosCarregados = false;
  
  constructor(public dialogRef: MatDialogRef<FichapagamentosvoluntariosComponent>, @Inject(MAT_DIALOG_DATA) public data: DataPagamentos, private fb: FormBuilder) {
    this.somarValores(data.Lista);
  }

  ngAfterViewInit(): void {
    this.todosElementosCarregados = true;
  }

  gerarDPF() {
      let pdf = new jsPDF('l', 'pt', 'a4');
  
      pdf.html(this.el.nativeElement, {
        callback: (pdf) => {
          pdf.save("pagamentos.pdf");
        }
      });
  
      this.Fechar();
  }

  Fechar(): void {
    this.dialogRef.close({});
  }

  getCorPorSexo(): string {
    return 'cor-azul';
  }
  
  getCorPorSexoTh(){
    return 'cor-background-color-homens';
  }


  somarValores(lista: ListPagamento[]){
    lista.forEach(item => {
      this.totaldinheiro += item.dinheiro || 0;
      this.totaldebito += item.debito || 0;
      this.totalcredVista += item.credVista || 0;
      this.totalcredParcelado += item.credParcelado || 0;
      this.totaltedPix += item.tedPix || 0;
      this.totaldescontar += item.descontar || 0;
      this.totalreceber += item.receber || 0;
    });
  }
}
