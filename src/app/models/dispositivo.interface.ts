export interface Dispositivo {
  _id?: string;
  modelo: string;
  tipo: string; // Campo abierto (no enum)
  foto?: string;
  marca: string; // ObjectId de Marca
  distribuidores: string[]; // Array de ObjectIds de Distribuidor
  fechaPublicacion?: string;
  tecnologia?: string[]; // Array de tecnologías
  frecuencias?: string[]; // Array de frecuencias
  gananciaAntena?: string[]; // Array de ganancia de antena
  EIRP?: string[]; // Array de EIRP
  modulo?: string[]; // Array de módulos
  createdAt?: string;
  updatedAt?: string;
}

export interface DispositivoCreate {
  modelo: string;
  tipo?: string; // Opcional, default vacío
  foto?: string;
  marca: string;
  distribuidores: string[];
  fechaPublicacion?: string;
  tecnologia?: string[];
  frecuencias?: string[];
  gananciaAntena?: string[];
  EIRP?: string[];
  modulo?: string[];
}

export interface DispositivoUpdate {
  modelo?: string;
  tipo?: string;
  foto?: string;
  marca?: string;
  distribuidores?: string[];
  fechaPublicacion?: string;
  tecnologia?: string[];
  frecuencias?: string[];
  gananciaAntena?: string[];
  EIRP?: string[];
  modulo?: string[];
}

// Interfaces para mostrar datos relacionados
export interface DispositivoWithRelations extends Omit<Dispositivo, 'marca' | 'distribuidores'> {
  marca?: {
    _id: string;
    fabricante: string;
    marca: string;
  };
  distribuidores?: Array<{
    _id: string;
    representante: string;
  }>;
}

