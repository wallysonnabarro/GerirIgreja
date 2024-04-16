import { Component, Inject } from '@angular/core';
import { DataImagens } from './DataImagens';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-imagem',
  templateUrl: './dialog-imagem.component.html',
  styleUrl: './dialog-imagem.component.css'
})
export class DialogImagemComponent {

  constructor(
    public dialogRef: MatDialogRef<DialogImagemComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DataImagens
  ) { }

  Fechar(): void {
    this.dialogRef.close({});
  }
}
