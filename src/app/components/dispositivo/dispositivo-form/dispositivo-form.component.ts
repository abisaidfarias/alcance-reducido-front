import { Component, Inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatChipsModule } from '@angular/material/chips';
import { MatRadioModule } from '@angular/material/radio';
import { Validators } from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';
import { DragDropModule, CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Dispositivo } from '../../../models/dispositivo.interface';
import { ImageUploadComponent } from '../../shared/image-upload/image-upload.component';
import { FileUploadComponent } from '../../shared/file-upload/file-upload.component';
import { MarcaService } from '../../../services/marca.service';
import { DistribuidorService } from '../../../services/distribuidor.service';
import { Marca } from '../../../models/marca.interface';
import { Distribuidor } from '../../../models/distribuidor.interface';

@Component({
  selector: 'app-dispositivo-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatChipsModule,
    MatRadioModule,
    DragDropModule,
    ImageUploadComponent,
    FileUploadComponent
  ],
  templateUrl: './dispositivo-form.component.html',
  styleUrl: './dispositivo-form.component.scss'
})
export class DispositivoFormComponent implements OnInit {
  dispositivoForm: FormGroup;
  isEditMode = false;
  marcas: Marca[] = [];
  distribuidores: Distribuidor[] = [];
  loadingMarcas = false;
  loadingDistribuidores = false;
  marcasLoaded = false;
  distribuidoresLoaded = false;
  // Guardar valores originales de certificación para restaurarlos si se cambia de 2025 a 2017
  private originalFechaCertificacionSubtel: Date | null = null;
  private originalOficioCertificacionSubtel: string = '';

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<DispositivoFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Dispositivo | null,
    private marcaService: MarcaService,
    private distribuidorService: DistribuidorService,
    private cdr: ChangeDetectorRef
  ) {
    // Inicializar según el modo: string para crear, array para editar
    const isEdit = !!this.data;
    this.dispositivoForm = this.fb.group({
      modelo: [''],
      tipo: [''], // Campo abierto, no enum
      foto: [''],
      marca: [''],
      distribuidor: isEdit ? [[] as string[]] : [''],
      fechaPublicacion: [''],
      tecnologia: [[] as string[]],
      frecuencias: [[] as string[]],
      gananciaAntena: [[] as string[]],
      EIRP: [[] as string[]],
      modulo: [[] as string[]],
      nombreTestReport: [[] as string[]],
      testReportFiles: [''],
      resolutionVersion: [null, Validators.required], // Resolución SUBTEL (obligatorio, se establece en ngOnInit o patchFormValues)
      fechaCertificacionSubtel: [null], // Fecha Certificación SUBTEL (opcional)
      oficioCertificacionSubtel: [''] // Oficio Certificación SUBTEL (opcional)
    });
  }

  ngOnInit(): void {
    // Establecer isEditMode inmediatamente si hay data
    if (this.data) {
      this.isEditMode = true;
      // Establecer resolutionVersion inmediatamente para evitar delay visual
      const resolutionVersionValue = this.getResolutionVersionValue();
      this.dispositivoForm.patchValue({
        resolutionVersion: resolutionVersionValue
      }, { emitEvent: false });
    } else {
      // Solo para crear: establecer 2025 por defecto
      this.dispositivoForm.patchValue({
        resolutionVersion: 2025
      }, { emitEvent: false });
    }
    
    this.loadMarcas();
    this.loadDistribuidores();

    // Manejar cambios en resolutionVersion: guardar/restaurar valores de certificación
    let previousResolutionVersion: 2017 | 2025 | null = null;
    
    // Guardar valores de certificación cada vez que cambian (solo si estamos en resolución 2017)
    this.dispositivoForm.get('fechaCertificacionSubtel')?.valueChanges.subscribe(() => {
      if (this.dispositivoForm.get('resolutionVersion')?.value === 2017) {
        this.originalFechaCertificacionSubtel = this.dispositivoForm.get('fechaCertificacionSubtel')?.value;
      }
    });
    
    this.dispositivoForm.get('oficioCertificacionSubtel')?.valueChanges.subscribe(() => {
      if (this.dispositivoForm.get('resolutionVersion')?.value === 2017) {
        this.originalOficioCertificacionSubtel = this.dispositivoForm.get('oficioCertificacionSubtel')?.value || '';
      }
    });
    
    // Manejar cambios en resolutionVersion
    this.dispositivoForm.get('resolutionVersion')?.valueChanges.subscribe(value => {
      // Solo procesar si realmente cambió el valor (no en la carga inicial)
      if (previousResolutionVersion !== null && previousResolutionVersion !== value) {
        if (value === 2025) {
          // Guardar valores actuales antes de limpiar (por si el usuario cambia de vuelta a 2017)
          this.originalFechaCertificacionSubtel = this.dispositivoForm.get('fechaCertificacionSubtel')?.value;
          this.originalOficioCertificacionSubtel = this.dispositivoForm.get('oficioCertificacionSubtel')?.value || '';
          // Limpiar los campos de certificación cuando se selecciona 2025
          this.dispositivoForm.patchValue({
            fechaCertificacionSubtel: null,
            oficioCertificacionSubtel: ''
          }, { emitEvent: false });
        } else if (value === 2017 && previousResolutionVersion === 2025) {
          // Restaurar valores guardados cuando se cambia de 2025 a 2017
          this.dispositivoForm.patchValue({
            fechaCertificacionSubtel: this.originalFechaCertificacionSubtel,
            oficioCertificacionSubtel: this.originalOficioCertificacionSubtel
          }, { emitEvent: false });
        }
      }
      // Actualizar el valor anterior
      previousResolutionVersion = value as 2017 | 2025;
    });
  }

  private getResolutionVersionValue(): 2017 | 2025 {
    // Manejar resolutionVersion: mapear el valor del dispositivo, solo usar 2025 si viene vacío
    let resolutionVersionValue: 2017 | 2025 = 2025; // Default 2025 si viene vacío o inválido
    
    if (!this.data) {
      return 2025;
    }
    
    // Si el dispositivo tiene resolutionVersion válido, usarlo
    const rawResolutionVersion: any = this.data.resolutionVersion;
    if (rawResolutionVersion !== undefined && rawResolutionVersion !== null) {
      let resolutionNum: number | null = null;
      
      // Convertir a número si viene como string
      if (typeof rawResolutionVersion === 'string') {
        const trimmedValue = String(rawResolutionVersion).trim();
        // Si es string vacío, mantener el default 2025
        if (trimmedValue === '') {
          resolutionVersionValue = 2025;
        } else {
          resolutionNum = parseInt(trimmedValue, 10);
        }
      } else if (typeof rawResolutionVersion === 'number') {
        resolutionNum = rawResolutionVersion;
      }
      
      // Solo asignar si es un número válido y es 2017 o 2025
      if (resolutionNum !== null && !isNaN(resolutionNum) && (resolutionNum === 2017 || resolutionNum === 2025)) {
        resolutionVersionValue = resolutionNum as 2017 | 2025;
      }
      // Si no es válido, resolutionVersionValue ya tiene el default 2025
    }
    // Si es undefined o null, resolutionVersionValue ya tiene el default 2025
    
    return resolutionVersionValue;
  }

  private patchFormValues(): void {
    if (!this.data) {
      return;
    }
    
    // Solo hacer patch si ambas listas están completamente cargadas
    if (!this.marcasLoaded || !this.distribuidoresLoaded) {
      return;
    }
    
    if (this.marcas.length === 0 || this.distribuidores.length === 0) {
      return;
    }
    
    // Manejar marca: puede venir como objeto o como string (ID)
    let marcaId = '';
    if (this.data.marca) {
      if (typeof this.data.marca === 'object' && this.data.marca !== null && '_id' in this.data.marca) {
        marcaId = (this.data.marca as any)._id;
      } else if (typeof this.data.marca === 'string') {
        marcaId = this.data.marca;
      }
    }
    
    // Manejar distribuidores: en modo edición puede venir como array de objetos o array de strings
    let distribuidorValue: string | string[] = '';
    if (this.data.distribuidores) {
      if (Array.isArray(this.data.distribuidores) && this.data.distribuidores.length > 0) {
        // En modo edición, mantener todos los distribuidores como array
        distribuidorValue = this.data.distribuidores.map((dist: any) => {
          if (typeof dist === 'object' && dist !== null && '_id' in dist) {
            return dist._id;
          } else if (typeof dist === 'string') {
            return dist;
          }
          return '';
        }).filter((id: string) => id !== '');
      } else if (typeof this.data.distribuidores === 'string') {
        distribuidorValue = [this.data.distribuidores];
      }
    }
    
    console.log('Patch form values:', {
      modelo: this.data.modelo,
      tipo: this.data.tipo,
      foto: this.data.foto,
      marcaId,
      distribuidorValue,
      marcasDisponibles: this.marcas.length,
      distribuidoresDisponibles: this.distribuidores.length
    });
    
    // Asegurar que distribuidorValue sea siempre un array para modo edición
    const distribuidorArray = Array.isArray(distribuidorValue) 
      ? distribuidorValue 
      : (distribuidorValue ? [distribuidorValue] : []);
    
    // Convertir fechaPublicacion de string a Date si existe
    let fechaPublicacionDate: Date | null = null;
    if (this.data!.fechaPublicacion) {
      fechaPublicacionDate = new Date(this.data!.fechaPublicacion);
      // Validar que la fecha sea válida
      if (isNaN(fechaPublicacionDate.getTime())) {
        fechaPublicacionDate = null;
      }
    }
    
    // Convertir fechaCertificacionSubtel de string a Date si existe
    let fechaCertificacionSubtelDate: Date | null = null;
    if (this.data!.fechaCertificacionSubtel) {
      fechaCertificacionSubtelDate = new Date(this.data!.fechaCertificacionSubtel);
      // Validar que la fecha sea válida
      if (isNaN(fechaCertificacionSubtelDate.getTime())) {
        fechaCertificacionSubtelDate = null;
      }
    }
    
    // Guardar valores originales de certificación para restaurarlos si el usuario cambia de 2025 a 2017
    this.originalFechaCertificacionSubtel = fechaCertificacionSubtelDate;
    this.originalOficioCertificacionSubtel = this.data!.oficioCertificacionSubtel || '';
    
    // Usar setTimeout para asegurar que Angular Material haya inicializado los selects
    // Nota: resolutionVersion ya se estableció inmediatamente en ngOnInit() para evitar delay visual
    setTimeout(() => {
      this.dispositivoForm.patchValue({
        modelo: this.data!.modelo || '',
        tipo: this.data!.tipo || '',
        foto: this.data!.foto || '',
        tecnologia: this.data!.tecnologia || [],
        frecuencias: this.data!.frecuencias || [],
        gananciaAntena: this.data!.gananciaAntena || [],
        EIRP: this.data!.EIRP || [],
        modulo: this.data!.modulo || [],
        nombreTestReport: this.data!.nombreTestReport || [],
        testReportFiles: this.data!.testReportFiles || '',
        marca: marcaId,
        distribuidor: distribuidorArray,
        fechaPublicacion: fechaPublicacionDate,
        // resolutionVersion ya se estableció en ngOnInit() inmediatamente, no es necesario establecerlo aquí
        fechaCertificacionSubtel: fechaCertificacionSubtelDate,
        oficioCertificacionSubtel: this.data!.oficioCertificacionSubtel || ''
      }, { emitEvent: false });
      
      // Forzar detección de cambios
      this.cdr.detectChanges();
    }, 100);
  }

  loadMarcas(): void {
    this.loadingMarcas = true;
    this.marcaService.getAll().subscribe({
      next: (data) => {
        let marcas: Marca[] = [];
        
        if (Array.isArray(data)) {
          marcas = data;
        } else if (data && typeof data === 'object') {
          if ('marcas' in data && Array.isArray((data as any).marcas)) {
            marcas = (data as any).marcas;
          } else if ('data' in data && Array.isArray((data as any).data)) {
            marcas = (data as any).data;
          }
        }
        
        this.marcas = marcas;
        this.loadingMarcas = false;
        this.marcasLoaded = true;
        this.patchFormValues();
      },
      error: (error) => {
        console.error('Error al cargar marcas:', error);
        this.marcas = [];
        this.loadingMarcas = false;
        this.marcasLoaded = true;
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
        this.distribuidoresLoaded = true;
        this.patchFormValues();
      },
      error: (error) => {
        console.error('Error al cargar distribuidores:', error);
        this.distribuidores = [];
        this.loadingDistribuidores = false;
        this.distribuidoresLoaded = true;
      }
    });
  }

  onSubmit(): void {
    const formValue = this.dispositivoForm.value;
    
    // Convertir fecha de Date a string ISO si existe
    let fechaPublicacionString: string | undefined = undefined;
    if (formValue.fechaPublicacion && formValue.fechaPublicacion instanceof Date) {
      // Convertir a formato ISO (YYYY-MM-DD)
      const year = formValue.fechaPublicacion.getFullYear();
      const month = String(formValue.fechaPublicacion.getMonth() + 1).padStart(2, '0');
      const day = String(formValue.fechaPublicacion.getDate()).padStart(2, '0');
      fechaPublicacionString = `${year}-${month}-${day}`;
    }
    
    // Convertir fechaCertificacionSubtel de Date a string ISO si existe
    // Solo si la resolución es 2017
    let fechaCertificacionSubtelString: string | null = null;
    if (formValue.resolutionVersion === 2017 && formValue.fechaCertificacionSubtel && formValue.fechaCertificacionSubtel instanceof Date) {
      // Convertir a formato ISO (YYYY-MM-DD)
      const year = formValue.fechaCertificacionSubtel.getFullYear();
      const month = String(formValue.fechaCertificacionSubtel.getMonth() + 1).padStart(2, '0');
      const day = String(formValue.fechaCertificacionSubtel.getDate()).padStart(2, '0');
      fechaCertificacionSubtelString = `${year}-${month}-${day}`;
    }
    
    // Asegurar que resolutionVersion siempre tenga un valor válido
    const resolutionVersionValue = formValue.resolutionVersion || 2025;
    
    const submitData: any = {
      modelo: formValue.modelo,
      tipo: formValue.tipo || '',
      foto: formValue.foto || '',
      marca: formValue.marca,
      fechaPublicacion: fechaPublicacionString,
      tecnologia: Array.isArray(formValue.tecnologia) ? formValue.tecnologia.filter((v: string) => v && v.trim() !== '') : [],
      frecuencias: Array.isArray(formValue.frecuencias) ? formValue.frecuencias.filter((v: string) => v && v.trim() !== '') : [],
      gananciaAntena: Array.isArray(formValue.gananciaAntena) ? formValue.gananciaAntena.filter((v: string) => v && v.trim() !== '') : [],
      EIRP: Array.isArray(formValue.EIRP) ? formValue.EIRP.filter((v: string) => v && v.trim() !== '') : [],
      modulo: Array.isArray(formValue.modulo) ? formValue.modulo.filter((v: string) => v && v.trim() !== '') : [],
      nombreTestReport: Array.isArray(formValue.nombreTestReport) ? formValue.nombreTestReport.filter((v: string) => v && v.trim() !== '') : [],
      testReportFiles: formValue.testReportFiles && typeof formValue.testReportFiles === 'string' ? formValue.testReportFiles.trim() : '',
      // Siempre incluir los 3 campos nuevos
      resolutionVersion: resolutionVersionValue,
      fechaCertificacionSubtel: resolutionVersionValue === 2017 ? fechaCertificacionSubtelString : null,
      oficioCertificacionSubtel: resolutionVersionValue === 2017 
        ? (formValue.oficioCertificacionSubtel && typeof formValue.oficioCertificacionSubtel === 'string' ? formValue.oficioCertificacionSubtel.trim() : '')
        : ''
    };
    
    // En modo edición, distribuidor es array; en creación, es string
    if (this.isEditMode) {
      submitData.distribuidores = Array.isArray(formValue.distribuidor) 
        ? formValue.distribuidor.filter((id: string) => id !== '') // Filtrar valores vacíos
        : [];
    } else {
      // En modo creación, convertir string a array
      submitData.distribuidores = formValue.distribuidor ? [formValue.distribuidor] : [];
    }
    
    this.dialogRef.close(submitData);
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  getMarcaDisplay(marcaId: string): string {
    const marca = this.marcas.find(m => m._id === marcaId);
    return marca ? marca.marca : marcaId;
  }

  getDistribuidorDisplay(distribuidorId: string): string {
    const distribuidor = this.distribuidores.find(d => d._id === distribuidorId);
    return distribuidor ? distribuidor.representante : distribuidorId;
  }

  // Separadores de teclado para chips (Enter y coma)
  separatorKeysCodes: number[] = [13, 188]; // Enter y coma
  
  // Separador solo Enter para nombreTestReport (evita problemas con comas en "Pag. 5,7")
  separatorKeysCodesEnterOnly: number[] = [13]; // Solo Enter

  // Obtener valor de un array del formulario
  getArrayValue(fieldName: string): string[] {
    const value = this.dispositivoForm.get(fieldName)?.value;
    return Array.isArray(value) ? value : [];
  }

  // Agregar valor a un array
  addToArray(event: MatChipInputEvent, fieldName: string): void {
    const input = event.input;
    const value = event.value;

    // Agregar el valor si no está vacío
    if ((value || '').trim()) {
      const currentValue = this.getArrayValue(fieldName);
      const trimmedValue = value.trim();
      
      // Evitar duplicados
      if (!currentValue.includes(trimmedValue)) {
        currentValue.push(trimmedValue);
        this.dispositivoForm.get(fieldName)?.setValue([...currentValue]);
      }
    }

    // Limpiar el input
    if (input) {
      input.value = '';
    }
  }

  // Remover valor de un array
  removeFromArray(fieldName: string, value: string): void {
    const currentValue = this.getArrayValue(fieldName);
    const index = currentValue.indexOf(value);

    if (index >= 0) {
      currentValue.splice(index, 1);
      this.dispositivoForm.get(fieldName)?.setValue([...currentValue]);
    }
  }

  // Manejar cambios en el archivo de test report
  onTestReportFilesChange(url: string): void {
    this.dispositivoForm.get('testReportFiles')?.setValue(url);
  }

  // Manejar drag and drop para reordenar chips
  drop(event: CdkDragDrop<string[]>, fieldName: string): void {
    const currentValue = this.getArrayValue(fieldName);
    moveItemInArray(currentValue, event.previousIndex, event.currentIndex);
    this.dispositivoForm.get(fieldName)?.setValue([...currentValue]);
  }
}

