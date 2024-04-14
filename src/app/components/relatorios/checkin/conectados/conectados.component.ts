import { Component, ElementRef, Inject, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DadosRelatorio } from '../../DadosRelatorio';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-conectados',
  templateUrl: './conectados.component.html',
  styleUrl: './conectados.component.css'
})
export class ConectadosComponent {

  @ViewChild('content', { static: false }) el!: ElementRef;
  src = "";
  interacao = 1;

  constructor(public dialogRef: MatDialogRef<ConectadosComponent>, @Inject(MAT_DIALOG_DATA) public data: DadosRelatorio, private fb: FormBuilder) {
  }

  // ngAfterViewInit(): void {
  //   setTimeout(() => {
  //     this.gerarDPF();
  //   }, 800);
  // }

  Fechar(): void {
    this.dialogRef.close({});
  }

  gerarDPF() {
    let pdf = new jsPDF('l', 'pt', 'a4');

    pdf.html(this.el.nativeElement, {
      callback: (pdf) => {
        if(this.data.sexo == 1){
          pdf.save("homens.pdf");
        } else {
          pdf.save("mulheres.pdf");
        }
      }
    })
    
    this.Fechar();
  }
}
