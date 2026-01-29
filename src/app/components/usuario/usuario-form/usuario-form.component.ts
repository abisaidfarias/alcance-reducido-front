import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { Usuario } from '../../../models/usuario.interface';
import { DistribuidorService } from '../../../services/distribuidor.service';
import { Distribuidor } from '../../../models/distribuidor.interface';

@Component({
  selector: 'app-usuario-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule
  ],
  templateUrl: './usuario-form.component.html',
  styleUrl: './usuario-form.component.scss'
})
export class UsuarioFormComponent implements OnInit {
  usuarioForm: FormGroup;
  isEditMode = false;
  distribuidores: Distribuidor[] = [];
  hidePassword = true;
  hideConfirmPassword = true;
  loadingDistribuidores = false;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<UsuarioFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Usuario | null,
    private distribuidorService: DistribuidorService
  ) {
    this.usuarioForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.minLength(6)]],
      confirmPassword: [''],
      rol: ['admin', Validators.required],
      distribuidorId: [null]
    }, { validators: this.passwordMatchValidator });
  }

  // Validador personalizado para verificar que las contraseñas coincidan
  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');
    
    if (!password || !confirmPassword) {
      return null;
    }
    
    // Si estamos en modo edición y no hay password, no validar
    if (!password.value) {
      if (confirmPassword.hasError('passwordMismatch')) {
        confirmPassword.setErrors({ passwordMismatch: null });
        confirmPassword.updateValueAndValidity({ emitEvent: false });
      }
      return null;
    }
    
    // Si hay password y no coinciden, retornar error
    if (password.value && confirmPassword.value && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }
    
    // Si coinciden, limpiar el error
    if (confirmPassword.hasError('passwordMismatch')) {
      confirmPassword.setErrors({ passwordMismatch: null });
      confirmPassword.updateValueAndValidity({ emitEvent: false });
    }
    
    return null;
  }

  ngOnInit(): void {
    if (this.data) {
      this.isEditMode = true;
      // En modo edición, la contraseña es opcional
      this.usuarioForm.get('password')?.clearValidators();
      this.usuarioForm.get('confirmPassword')?.clearValidators();
      this.usuarioForm.get('password')?.updateValueAndValidity();
      this.usuarioForm.get('confirmPassword')?.updateValueAndValidity();
      
      this.usuarioForm.patchValue({
        nombre: this.data.nombre,
        email: this.data.email,
        rol: this.data.rol || 'admin',
        distribuidorId: this.data.distribuidorId || null
      });
    } else {
      // En modo creación, la contraseña y confirmación son requeridas
      this.usuarioForm.get('password')?.setValidators([Validators.required, Validators.minLength(6)]);
      this.usuarioForm.get('confirmPassword')?.setValidators([Validators.required]);
      this.usuarioForm.get('password')?.updateValueAndValidity();
      this.usuarioForm.get('confirmPassword')?.updateValueAndValidity();
    }

    // Escuchar cambios en password y confirmPassword para validar coincidencia
    this.usuarioForm.get('password')?.valueChanges.subscribe(() => {
      if (this.usuarioForm.get('confirmPassword')?.value) {
        this.usuarioForm.get('confirmPassword')?.updateValueAndValidity({ emitEvent: false });
      }
    });
    
    this.usuarioForm.get('confirmPassword')?.valueChanges.subscribe(() => {
      if (this.usuarioForm.get('password')?.value && this.usuarioForm.get('confirmPassword')?.value) {
        this.passwordMatchValidator(this.usuarioForm);
      }
    });
  }

  loadDistribuidores(): void {
    this.loadingDistribuidores = true;
    this.distribuidorService.getAll().subscribe({
      next: (data) => {
        let distribuidores: Distribuidor[] = [];
        
        if (Array.isArray(data)) {
          distribuidores = data;
        } else if (data && typeof data === 'object') {
          if ('data' in data && Array.isArray((data as any).data)) {
            distribuidores = (data as any).data;
          } else if ('distribuidores' in data && Array.isArray((data as any).distribuidores)) {
            distribuidores = (data as any).distribuidores;
          }
        }
        
        this.distribuidores = distribuidores;
        this.loadingDistribuidores = false;
      },
      error: (error) => {
        console.error('Error al cargar distribuidores:', error);
        this.distribuidores = [];
        this.loadingDistribuidores = false;
      }
    });
  }

  onSubmit(): void {
    if (this.usuarioForm.valid) {
      const formValue = { ...this.usuarioForm.value };
      
      // Eliminar confirmPassword antes de enviar
      delete formValue.confirmPassword;
      
      // Si estamos editando y no se proporcionó contraseña, no incluirla
      if (this.isEditMode && !formValue.password) {
        delete formValue.password;
      }
      
      // Limpiar distribuidorId ya que solo hay rol admin
      formValue.distribuidorId = null;
      
      this.dialogRef.close(formValue);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  getRolDisplay(rol: string): string {
    const roles: { [key: string]: string } = {
      'usuario': 'Usuario',
      'admin': 'Administrador',
      'distribuidor': 'Distribuidor'
    };
    return roles[rol] || rol;
  }
}

