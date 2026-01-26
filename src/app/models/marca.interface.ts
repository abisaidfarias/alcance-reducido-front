export interface Marca {
  _id?: string;
  fabricante: string;
  marca: string;
  logo?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface MarcaCreate {
  fabricante: string;
  marca: string;
  logo?: string;
}

export interface MarcaUpdate {
  fabricante?: string;
  marca?: string;
  logo?: string;
}

