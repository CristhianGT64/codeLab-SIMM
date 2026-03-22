export interface TipoDocumento {
  id: string;
  codigo: string;
  nombre: string;
  descripcion: string;
  prefijoNumeracion: string;
  requiereCai: boolean;
  activo: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface TipoDocumentoForm {
  codigo: string;
  nombre: string;
  descripcion: string;
  prefijoNumeracion: string;
  requiereCai: boolean;
  activo: boolean;
}

export interface TipoDocumentoListResponse {
  success: boolean;
  data: TipoDocumento[];
  message?: string;
}

export interface TipoDocumentoSingleResponse {
  success: boolean;
  data: TipoDocumento;
  message?: string;
}

export const tipoDocumentoFormEmpty: TipoDocumentoForm = {
  codigo: "",
  nombre: "",
  descripcion: "",
  prefijoNumeracion: "",
  requiereCai: false,
  activo: true,
};