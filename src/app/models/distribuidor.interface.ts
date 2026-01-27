export interface Distribuidor {
  _id?: string;
  representante: string; // Identificador para URL (solo alfanuméricos)
  nombreRepresentante: string; // Nombre completo para mostrar (permite cualquier carácter)
  domicilio?: string;
  sitioWeb?: string;
  email?: string;
  logo?: string;
  dispositivos?: string[]; // Array de IDs de dispositivos
  createdAt?: string;
  updatedAt?: string;
}

export interface DistribuidorCreate {
  representante: string; // Identificador para URL (solo alfanuméricos)
  nombreRepresentante: string; // Nombre completo para mostrar (permite cualquier carácter)
  domicilio?: string;
  sitioWeb?: string;
  email?: string;
  logo?: string;
  dispositivos?: string[];
}

export interface DistribuidorUpdate {
  representante?: string; // Identificador para URL (solo alfanuméricos)
  nombreRepresentante?: string; // Nombre completo para mostrar (permite cualquier carácter)
  domicilio?: string;
  sitioWeb?: string;
  email?: string;
  logo?: string;
  dispositivos?: string[];
}

