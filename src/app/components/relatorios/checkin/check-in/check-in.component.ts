import { Component, ElementRef, Inject, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DadosRelatorio } from '../../DadosRelatorio';
import jsPDF from 'jspdf';
import { UtilitariosService } from '../../../../services/utilitarios/utilitarios.service';

@Component({
  selector: 'app-check-in',
  templateUrl: './check-in.component.html',
  styleUrl: './check-in.component.css'
})
export class CheckInComponent {

  @ViewChild('content', { static: false }) el!: ElementRef;
  src = "";
  base64Image: string | null = null;
  form: FormGroup;

  constructor(public dialogRef: MatDialogRef<CheckInComponent>, @Inject(MAT_DIALOG_DATA) public data: DadosRelatorio, private fb: FormBuilder,
    private utilService: UtilitariosService) {
      this.form = this.fb.group({
        titulo: ['', [Validators.required]],
        subtitulo: ['', [Validators.required]],
      });
  
  }

  // ngOnInit(): void {
  //   this.src = this.utilService.converterUint16ArrayParaImagem(this.data.imagem);
  // }

  // ngAfterViewInit(): void {
  //   setTimeout(() => {
  //     this.gerarDPF();
  //   }, 800);
  // }

  gerarDPF() {
    let pdf = new jsPDF('p', 'pt', 'a4');
    const dataAtual = new Date();
    const dataFormatada = `${dataAtual.getFullYear()}-${String(dataAtual.getMonth() + 1).padStart(2, '0')}-${String(dataAtual.getDate()).padStart(2, '0')}`;
    const nomeDoArquivo = `${this.data.nome}_${dataFormatada}.pdf`;

    pdf.html(this.el.nativeElement, {
      callback: (pdf) => {
        pdf.save(nomeDoArquivo);
      }
    })
    this.Fechar();
  }

  Fechar(): void {
    this.dialogRef.close({});
  } 

  onFileSelected(event: any) {
    const file: File = event.target.files[0];

    if (file) {
      const fileNameParts = file.name.split('.');
      const fileExtension = fileNameParts[fileNameParts.length - 1].toLowerCase();

      if (fileExtension !== 'png') {
        alert('Por favor, selecione um arquivo PNG.');
        event.target.value = null;
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        this.base64Image = reader.result as string; 
        this.src = this.base64Image; 
        console.log(this.base64Image); 
      };
      reader.readAsDataURL(file);
    }
  }

  inserir(){
    if(this.form.valid){
      const {titulo, subtitulo} = this.form.value;

      this.data.tituloRelatorio = titulo;
      this.data.subTituloRelatorio = subtitulo;      
    } else {
      alert('Por favor, preencha os dados de título e subtítulo.');
    }
  }
}
