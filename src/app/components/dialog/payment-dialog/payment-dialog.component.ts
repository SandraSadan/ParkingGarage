import { Component, Inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-payment-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
  templateUrl: './payment-dialog.component.html',
  styleUrl: './payment-dialog.component.scss'
})
export class PaymentDialogComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) 
   public data: number[],
    private dialogRef: MatDialogRef<PaymentDialogComponent>) {
  }

  ngOnInit() {}

  pay() {
    this.dialogRef.close(true);
  }

  close() {
    this.dialogRef.close();
  }

}
