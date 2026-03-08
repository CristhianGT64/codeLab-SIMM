import type { HeaderAdmin } from "../../interfaces/Headers/HeaderInterface";
import type { InformacionImportanteInterface } from "../../interfaces/informacionImportante/InformacionImportanteInterface";

export const InformacionImportantePermisos: InformacionImportanteInterface = {
  titulo: "Información importante para permisos",
  puntos: [
    "Los permisos nuevos estarán disponibles inmediatamente para asignar a roles",
    "Usa nombres claros y específicos para facilitar su identificación",
    "La categoría ayuda a organizar los permisos por módulos funcionales",
    "Puedes crear nuevas categorías o usar las existentes del sistema",
  ],
};

export const HeaderCreatePermission : HeaderAdmin = {
  title: 'Agregar Nuevo Permiso',
  subTitle: 'Crea un nuevo permiso para asignarlo a los roles del sistema'
}