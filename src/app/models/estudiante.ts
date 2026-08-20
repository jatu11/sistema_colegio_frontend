export interface Estudiante {
  id?: number; // Es opcional porque al crearlo aún no tiene ID
  cedula: string;
  matricula: string; // El código naval
  nombres: string;
  apellidos: string;
  curso: string;
  tipoSangre?: string;
  nombreRepresentante?: string;
  telefonoRepresentante?: string;
  activo?: boolean;
  fechaRegistro?: string;
}