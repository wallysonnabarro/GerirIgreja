import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { DialogDataCancelar } from './DialogDataCancelar';

@Component({
  selector: 'app-dialog-interacao',
  templateUrl: './dialog-interacao.component.html',
  styleUrl: './dialog-interacao.component.css'
})
export class DialogInteracaoComponent {

  constructor(
    public dialogRef: MatDialogRef<DialogInteracaoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogDataCancelar
  ) { }

  Fechar(): void {
    this.dialogRef.close({});
  }

  OK(): void {
    this.dialogRef.close({ atualizar: true });
  }
}
