export interface Dispositivo {
  _id?: string;
  modelo: string;
  nombreComercial?: string; // Nombre comercial del equipo
  tipo: string; // Campo abierto (no enum)
  foto?: string;
  marca: string; // ObjectId de Marca
  distribuidor: string | null; // ObjectId de Distribuidor (un solo distribuidor)
  fechaPublicacion?: string;
  tecnologia?: string[]; // Array de tecnologías
  frecuencias?: string[]; // Array de frecuencias
  gananciaAntena?: string[]; // Array de ganancia de antena
  EIRP?: string[]; // Array de EIRP
  modulo?: string[]; // Array de módulos
  nombreTestReport?: string[]; // Array de nombres de Test Report
  testReportFiles?: string; // URL del archivo de Test Report
  resolutionVersion: 2017 | 2025; // Resolución SUBTEL (obligatorio)
  fechaCertificacionSubtel: string | null; // Fecha de certificación SUBTEL (ISO string o null)
  oficioCertificacionSubtel: string; // Oficio de certificación SUBTEL (opcional)
  createdAt?: string;
  updatedAt?: string;
}

export interface DispositivoCreate {
  modelo: string;
  tipo?: string; // Opcional, default vacío
  foto?: string;
  marca: string;
  distribuidor: string | null; // ObjectId de Distribuidor (un solo distribuidor)
  fechaPublicacion?: string;
  tecnologia?: string[];
  frecuencias?: string[];
  gananciaAntena?: string[];
  EIRP?: string[];
  modulo?: string[];
  nombreTestReport?: string[];
  testReportFiles?: string;
  resolutionVersion: 2017 | 2025; // Resolución SUBTEL (obligatorio)
  fechaCertificacionSubtel?: string | null; // Fecha de certificación SUBTEL (ISO string o null)
  oficioCertificacionSubtel?: string; // Oficio de certificación SUBTEL (opcional, default '')
}

export interface DispositivoUpdate {
  modelo?: string;
  tipo?: string;
  foto?: string;
  marca?: string;
  distribuidor?: string | null; // ObjectId de Distribuidor (un solo distribuidor)
  fechaPublicacion?: string;
  tecnologia?: string[];
  frecuencias?: string[];
  gananciaAntena?: string[];
  EIRP?: string[];
  modulo?: string[];
  nombreTestReport?: string[];
  testReportFiles?: string;
  resolutionVersion?: 2017 | 2025; // Resolución SUBTEL
  fechaCertificacionSubtel?: string | null; // Fecha de certificación SUBTEL (ISO string o null)
  oficioCertificacionSubtel?: string; // Oficio de certificación SUBTEL (opcional)
}

// Interfaces para mostrar datos relacionados
export interface DispositivoWithRelations extends Omit<Dispositivo, 'marca' | 'distribuidor'> {
  marca?: {
    _id: string;
    fabricante: string;
    marca: string;
  };
  distribuidor?: {
    _id: string;
    representante: string;
  } | null;
}
