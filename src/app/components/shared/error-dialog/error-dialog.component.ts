import { Component, Inject } from '@angular/core';
import { CommonModule, JsonPipe } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

export interface ErrorDialogData {
  title?: string;
  message: string;
  error?: any;
}

@Component({
  selector: 'app-error-dialog',
  standalone: true,
  imports: [
    CommonModule,
    JsonPipe,
    MatDialogModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './error-dialog.component.html',
  styleUrl: './error-dialog.component.scss'
})
export class ErrorDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ErrorDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ErrorDialogData
  ) {}

  onClose(): void {
    this.dialogRef.close();
  }

  getErrorMessage(): string {
    if (this.data.error) {
      if (this.data.error.error?.message) {
        return this.data.error.error.message;
      }
      if (this.data.error.message) {
        return this.data.error.message;
      }
      if (typeof this.data.error === 'string') {
        return this.data.error;
      }
    }
    return this.data.message;
  }
}
