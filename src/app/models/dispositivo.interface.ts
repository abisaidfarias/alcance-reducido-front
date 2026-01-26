export interface Dispositivo {
  _id?: string;
  modelo: string;
  tipo: 'telefono';
  foto?: string;
  marca: string; // ObjectId de Marca
  distribuidores: string[]; // Array de ObjectIds de Distribuidor
  fechaPublicacion?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface DispositivoCreate {
  modelo: string;
  tipo: 'telefono';
  foto?: string;
  marca: string;
  distribuidores: string[];
  fechaPublicacion?: string;
}

export interface DispositivoUpdate {
  modelo?: string;
  tipo?: 'telefono';
  foto?: string;
  marca?: string;
  distribuidores?: string[];
  fechaPublicacion?: string;
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

