export type NivelCatalogoContable =
  | "elemento"
  | "clasificacion"
  | "cuenta"
  | "subcuenta";

export interface NaturalezaContable {
  id: string;
  nombre: string;
  codigo?: string;
  disponible?: boolean;
}

export interface ElementoContable {
  id: string;
  uuidElementoContable: string;
  nombre: string;
  codigoNumerico: number;
  disponible: boolean;
  idNaturaleza?: string;
  naturaleza?: NaturalezaContable;
  clasificaciones?: ClasificacionContable[];
}

export interface ClasificacionContable {
  id: string;
  uuidClasificacionContable: string;
  uuidElementoContable: string;
  nombre: string;
  codigoNumerico: number;
  disponible: boolean;
  elementoContable?: Pick<
    ElementoContable,
    "id" | "uuidElementoContable" | "nombre" | "codigoNumerico" | "disponible"
  >;
  cuentas?: CuentaContable[];
}

export interface CuentaContable {
  id: string;
  uuidCuentaContable: string;
  uuidElementoContable: string;
  uuidClasificacionContable: string;
  nombre: string;
  codigoNumerico: number;
  disponible: boolean;
  idNaturaleza?: string;
  elementoContable?: Pick<
    ElementoContable,
    "id" | "uuidElementoContable" | "nombre" | "codigoNumerico" | "disponible"
  >;
  clasificacionContable?: Pick<
    ClasificacionContable,
    "id" | "uuidClasificacionContable" | "nombre" | "codigoNumerico" | "disponible"
  >;
  subcuentas?: SubCuentaContable[];
}

export interface SubCuentaContable {
  id: string;
  uuidSubCuentaContable: string;
  uuidElementoContable: string;
  uuidClasificacionContable: string;
  uuidCuentaContable: string;
  nombre: string;
  codigoNumerico: number;
  disponible: boolean;
  idNaturaleza?: string;
  cuentaContable?: Pick<
    CuentaContable,
    "id" | "uuidCuentaContable" | "nombre" | "codigoNumerico" | "disponible"
  >;
}

export interface CatalogoContableResumen {
  totalElementos: number;
  totalClasificaciones: number;
  totalCuentas: number;
  totalSubcuentas: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

export interface CrearElementoContablePayload {
  nombre: string;
  idNaturaleza: string;
  disponible?: boolean;
}

export interface ActualizarElementoContablePayload {
  id: string;
  nombre: string;
  idNaturaleza?: string;
  disponible?: boolean;
}

export interface CambiarEstadoCatalogoPayload {
  id: string;
  disponible: boolean;
}

export interface CrearClasificacionContablePayload {
  nombre: string;
  uuidElementoContable: string;
  disponible?: boolean;
}

export interface ActualizarClasificacionContablePayload {
  id: string;
  nombre: string;
  disponible?: boolean;
}

export interface CrearCuentaContablePayload {
  nombre: string;
  uuidElementoContable: string;
  uuidClasificacionContable: string;
  idNaturaleza: string;
  disponible?: boolean;
}

export interface ActualizarCuentaContablePayload {
  id: string;
  nombre: string;
  disponible?: boolean;
}

export interface CrearSubCuentaContablePayload {
  nombre: string;
  uuidElementoContable: string;
  uuidClasificacionContable: string;
  uuidCuentaContable: string;
  idNaturaleza: string;
  disponible?: boolean;
}

export interface ActualizarSubCuentaContablePayload {
  id: string;
  nombre: string;
  idNaturaleza?: string;
  disponible?: boolean;
}

export interface CatalogoFormState {
  nivel: NivelCatalogoContable;
  id?: string;
  nombre: string;
  idNaturaleza: string;
  uuidElementoContable: string;
  uuidClasificacionContable: string;
  uuidCuentaContable: string;
  disponible: boolean;
}