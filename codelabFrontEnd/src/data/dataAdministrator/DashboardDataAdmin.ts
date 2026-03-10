import type { DashboardInterface } from "../../interfaces/DashboardInterface";

export const DashboardDataAdmin : DashboardInterface [] = [
  {
    svg: "M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z",
    title: "Usuarios",
    description: "Gestión de usuarios: Creación, eliminación, edición y más",
    buttonDescription: "Administrar →",
    colorBorder: "border-[#4a6eb0]",
    colorSvg: "from-[#4a6eb0] to-[#11a2a5]",
    url : '/Users-Management',
    permiso : 'Ver usuarios'
  },
  {
    svg: "M15.75 1.5a6.75 6.75 0 0 0-6.651 7.906c.067.39-.032.717-.221.906l-6.5 6.499a3 3 0 0 0-.878 2.121v2.818c0 .414.336.75.75.75H6a.75.75 0 0 0 .75-.75v-1.5h1.5A.75.75 0 0 0 9 19.5V18h1.5a.75.75 0 0 0 .53-.22l2.658-2.658c.19-.189.517-.288.906-.22A6.75 6.75 0 1 0 15.75 1.5Zm0 3a.75.75 0 0 0 0 1.5A2.25 2.25 0 0 1 18 8.25a.75.75 0 0 0 1.5 0 3.75 3.75 0 0 0-3.75-3.75Z",
    title: "Roles y permisos",
    description: "Gestión de Roles y permisos: Creación, eliminación, edición de roles y permisos",
    buttonDescription: "Administrar →",
    colorBorder: "border-[#11a2a5]",
    colorSvg: "from-[#11a2a5] to-[#00a99d]",
    url : '/RolesPermision-Management',
    permiso : 'Ver roles'
  },
  {
    svg: "M8.25 21v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21m0 0h4.5V3.545M12.75 21h7.5V10.75M2.25 21h1.5m18 0h-18M2.25 9l4.5-1.636M18.75 3l-1.5.545m0 6.205 3 1m1.5.5-1.5-.5M6.75 7.364V3h-3v18m3-13.636 10.5-3.819",
    title: "Sucursales",
    description: "Gestión de sucursales: Creación, eliminación, edición y más",
    buttonDescription: "Administrar →",
    colorBorder: "border-[#11a2a5]",
    colorSvg: "from-[#11a2a5] to-[#00a99d]",
    url : '/Branches-Management',
    permiso : 'Ver sucursales'
  },
  {
    svg: "M6.912 3a3 3 0 0 0-2.868 2.118l-2.411 7.838a3 3 0 0 0-.133.882V18a3 3 0 0 0 3 3h15a3 3 0 0 0 3-3v-4.162c0-.299-.045-.596-.133-.882l-2.412-7.838A3 3 0 0 0 17.088 3H6.912Zm13.823 9.75-2.213-7.191A1.5 1.5 0 0 0 17.088 4.5H6.912a1.5 1.5 0 0 0-1.434 1.059L3.265 12.75H6.11a3 3 0 0 1 2.684 1.658l.256.513a1.5 1.5 0 0 0 1.342.829h3.218a1.5 1.5 0 0 0 1.342-.83l.256-.512a3 3 0 0 1 2.684-1.658h2.844Z",
    title: "Productos",
    description: "Gestión de Productos: Creación, eliminación, edición y más",
    buttonDescription: "Administrar →",
    colorBorder: "border-[#4a6eb0]",
    colorSvg: "from-[#4a6eb0] to-[#00a99d]",
    url : '/Product-Management',
    permiso : 'Ver productos'
  },
];



