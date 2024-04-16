import { Component, ElementRef, Inject, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DadosRelatorio } from '../../DadosRelatorio';
import jsPDF from 'jspdf';
import { sexoEnum } from '../../../../enums/sexoEnum';

@Component({
  selector: 'app-conectados',
  templateUrl: './conectados.component.html',
  styleUrl: './conectados.component.css'
})
export class ConectadosComponent {

  @ViewChild('content', { static: false }) el!: ElementRef;
  src = "";
  base64Image: string | null = null;
  form: FormGroup;
  interacao = 1;

  constructor(public dialogRef: MatDialogRef<ConectadosComponent>, @Inject(MAT_DIALOG_DATA) public data: DadosRelatorio, private fb: FormBuilder) {
    this.form = this.fb.group({
      titulo: ['', [Validators.required]]
    });

    this.getCorPorSexo();
    this.getCorPorSexoTh();
  }

  getCorPorSexo(): string {
    return this.data.sexo === sexoEnum.Masculino ? 'cor-azul' : 'cor-rosa';
  }

  getCorPorSexoTh(){
    return this.data.sexo === sexoEnum.Masculino ? 'cor-background-color-homens' : 'cor-background-color-mulheres';
  }

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
  
  inserir(){
    if(this.form.valid){
      const {titulo} = this.form.value;

      this.data.tituloRelatorio = titulo; 
    } else {
      alert('Por favor, preencha os dados de título e subtítulo.');
    }
  }
}
