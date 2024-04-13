import { AfterViewInit, Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DadosRelatorio } from '../../DadosRelatorio';
import jsPDF from 'jspdf';
import { UtilitariosService } from '../../../../services/utilitarios/utilitarios.service';

@Component({
  selector: 'app-check-in',
  templateUrl: './check-in.component.html',
  styleUrl: './check-in.component.css'
})
export class CheckInComponent implements OnInit, AfterViewInit {

  @ViewChild('content', { static: false }) el!: ElementRef;
  src = "";


  constructor(public dialogRef: MatDialogRef<CheckInComponent>, @Inject(MAT_DIALOG_DATA) public data: DadosRelatorio, private fb: FormBuilder,
    private utilService: UtilitariosService) {
  }

  ngOnInit(): void {
    this.src = this.utilService.converterUint16ArrayParaImagem(this.data.imagem);
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.gerarDPF();
    }, 800);
  }

  gerarDPF() {
    let pdf = new jsPDF('p', 'pt', 'a4');

    pdf.html(this.el.nativeElement, {
      callback: (pdf) => {
        pdf.save("h.pdf");
      }
    })
    this.Fechar();
  }

  Fechar(): void {
    this.dialogRef.close({});
  }
}
