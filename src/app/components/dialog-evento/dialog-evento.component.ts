import { Component, EventEmitter, Inject, Output } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DialogDataEvento } from './DialogDataEvento';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DialogComponent } from '../dialog/dialog.component';

@Component({
  selector: 'app-dialog-evento',
  templateUrl: './dialog-evento.component.html',
  styleUrl: './dialog-evento.component.css'
})
export class DialogEventoComponent {
  form: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<DialogEventoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogDataEvento, private fb: FormBuilder, private dialog: MatDialog
  ) {
    this.form = this.fb.group({
      id: ['', [Validators.required]]
    });
  }
 
  OK() {
    if (this.form.valid) {
      const { id } = this.form.value;
      this.dialogRef.close({ id: id });
    } else {
      this.openDialog("Selecione um evento.");
    }
  }

  Fechar(): void {
    if (this.form.valid) {
      const { id } = this.form.value;
      this.dialogRef.close({ id: id });
    } else {
      this.openDialog("Selecione um evento.");
    }
  }

  openDialog(p: string): void {
    const dialogRef = this.dialog.open(DialogComponent, {
      data: { titulo: 'Login', paragrafo: p },
      width: '350px',
    });

    dialogRef.afterClosed().subscribe(result => {
    });
  }

}
