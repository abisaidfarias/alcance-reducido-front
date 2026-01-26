export interface Distribuidor {
  _id?: string;
  representante: string;
  domicilio?: string;
  sitioWeb?: string;
  email?: string;
  logo?: string;
  dispositivos?: string[]; // Array de IDs de dispositivos
  createdAt?: string;
  updatedAt?: string;
}

export interface DistribuidorCreate {
  representante: string;
  domicilio?: string;
  sitioWeb?: string;
  email?: string;
  logo?: string;
  dispositivos?: string[];
}

export interface DistribuidorUpdate {
  representante?: string;
  domicilio?: string;
  sitioWeb?: string;
  email?: string;
  logo?: string;
  dispositivos?: string[];
}

