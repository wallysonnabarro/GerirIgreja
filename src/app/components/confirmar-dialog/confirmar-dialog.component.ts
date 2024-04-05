import { Component, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { DialogEventoComponent } from '../dialog-evento/dialog-evento.component';
import { DialogComponent } from '../dialog/dialog.component';
import { DialogConfirmacao } from './DialogConfirmacao';

@Component({
  selector: 'app-confirmar-dialog',
  templateUrl: './confirmar-dialog.component.html',
  styleUrl: './confirmar-dialog.component.css'
})
export class ConfirmarDialogComponent {
  form: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<DialogEventoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogConfirmacao, private fb: FormBuilder, private dialog: MatDialog
  ) {
    this.form = this.fb.group({
      id: ['', [Validators.required]],
      debito: [''],
      dinheiro: [''],
      credito: [''],
      creditoParcelado: [''],
      pix: [''],
      parcelas: [''],
      receber: [''],
      decontar: [''],      
      tipo: [''],    
      evento: [''],    
      observacao: [''],
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
      this.dialogRef.close({ });
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
