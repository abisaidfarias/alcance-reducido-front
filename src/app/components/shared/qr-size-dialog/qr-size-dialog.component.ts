import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatRadioModule } from '@angular/material/radio';
import { FormsModule } from '@angular/forms';

export interface QrSizeOption {
  value: number;
  label: string;
  description: string;
}

@Component({
  selector: 'app-qr-size-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatRadioModule,
    FormsModule
  ],
  templateUrl: './qr-size-dialog.component.html',
  styleUrl: './qr-size-dialog.component.scss'
})
export class QrSizeDialogComponent {
  selectedSize: number = 600;

  sizeOptions: QrSizeOption[] = [
    { value: 200, label: '200px', description: 'Estándar' },
    { value: 400, label: '400px', description: 'Grande' },
    { value: 600, label: '600px', description: 'Alta resolución' }
  ];

  constructor(
    public dialogRef: MatDialogRef<QrSizeDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  onGenerate(): void {
    this.dialogRef.close(this.selectedSize);
  }

  onCancel(): void {
    this.dialogRef.close(null);
  }
}
