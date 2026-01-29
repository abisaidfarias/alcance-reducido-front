export interface Usuario {
  _id?: string;
  nombre: string;
  email: string;
  password?: string; // Solo para crear/actualizar, no se devuelve en GET
  rol: 'usuario' | 'admin' | 'distribuidor';
  distribuidorId?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface UsuarioCreate {
  nombre: string;
  email: string;
  password: string;
  rol: 'usuario' | 'admin' | 'distribuidor';
  distribuidorId?: string | null;
}

export interface UsuarioUpdate {
  nombre?: string;
  email?: string;
  password?: string;
  rol?: 'usuario' | 'admin' | 'distribuidor';
  distribuidorId?: string | null;
}

