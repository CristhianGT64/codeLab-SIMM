import type NavBarInterface from "../../interfaces/NavBarInterface";

const navBarData: NavBarInterface = {
  nameBuild: "SIMM",
  modules: [
    {
      text: "Usuarios",
      icon: "fa-solid fa-users",
      url: "/Users-Management",
      disable: false,
      permiso: "Ver usuarios",
    },
    {
      text: "Roles y permisos",
      icon: "fa-solid fa-key",
      url: "/RolesPermision-Management",
      disable: false,
      permiso: "Ver roles",
    },
    {
      text: "Sucursales",
      icon: "fa-solid fa-building-flag",
      url: "/Branches-Management",
      disable: false,
      permiso: "Ver sucursales",
    },
    {
      text: "Productos",
      icon: "fa-solid fa-box",
      url: "/Product-Management",
      disable: false,
      permiso: "Ver productos",
    },
    {
      text: "Movimientos",
      icon: "fa-solid fa-dolly",
      url: "/Inventario-Management",
      disable: false,
      permiso: "Movimientos inventario",
    },
    {
      text: "Facturación",
      icon: "fa-solid fa-receipt",
      url: "/Facturacion-Management",
      disable: false,
      permiso: "Facturacion",
    },
    {
      text: "Clientes",
      icon: "fa-solid fa-user",
      url : "/Clients-Management",
      disable : false,
      permiso : "Ver clientes"
    },
  ],
  nameUser: "Administrador",
};

export default navBarData;
