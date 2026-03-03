import type { DashboardInterface } from "../../interfaces/DashboardInterface";

export const DashboardDataAdmin : DashboardInterface [] = [
  {
    svg: "M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z",
    title: "Usuarios",
    description: "Gestión de usuarios: Creación, eliminación, edición y más",
    buttonDescription: "Administrar →",
    colorBorder: "border-[#4a6eb0]",
    colorSvg: "from-[#4a6eb0] to-[#11a2a5]",
    url : '/Users-Management'
  },
  {
    svg: "M8.25 21v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21m0 0h4.5V3.545M12.75 21h7.5V10.75M2.25 21h1.5m18 0h-18M2.25 9l4.5-1.636M18.75 3l-1.5.545m0 6.205 3 1m1.5.5-1.5-.5M6.75 7.364V3h-3v18m3-13.636 10.5-3.819",
    title: "Sucursales",
    description: "Gestión de sucursales: Creación, eliminación, edición y más",
    buttonDescription: "Administrar →",
    colorBorder: "border-[#11a2a5]",
    colorSvg: "from-[#11a2a5] to-[#00a99d]",
    url : '/Branches-Management'
  },
];


