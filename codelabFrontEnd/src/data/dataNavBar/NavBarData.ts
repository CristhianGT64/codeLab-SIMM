import type NavBarInterface from "../../interfaces/NavBarInterface";

const navBarData: NavBarInterface = {
  nameBuild: "SIMM",
  modules: [
    {
      text: "Reportes",
      icon: "fa-solid fa-chart-column",
      url: "/Reportes-Management",
      disable: false,
    },
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
      text: "Config. CAI",
      icon: "fa-solid fa-receipt",
      url: "/Configuracion/CAI",
      disable: false,
      permiso: "Ver configuración CAI",
    },
    {
      text: "Impuestos",
      icon: "fa-solid fa-percent",
      url: "/Configuracion/Impuestos",
      disable: false,
      permiso: "Ver productos",
    },
    {
      text: "Facturas",
      icon: "fa-solid fa-file-invoice-dollar",
      url: "/Facturas-Management",
      disable: false,
      permiso: "Revisar Facturas",
    },
    {
      text: "Ventas POS",
      icon: "fa-solid fa-cart-shopping",
      url : "/Ventas-Management",
      disable : false,
      permiso : "Ver punto de ventas POS"
    },
    {
      text: "Clientes",
      icon: "fa-solid fa-user",
      url : "/Clients-Management",
      disable : false,
      permiso : "Ver clientes"
    },
    {
      text: "Tipos Doc.",
      icon: "fa-solid fa-file-invoice",
      url: "/Tipos-Documento-Management",
      disable: false,
      permiso: "Ver tipos de documento",
    },
    {
      text: "Catálogo Ctas.",
      icon: "fa-solid fa-book-open",
      url: "/Catalogo-Cuentas-Contables",
      disable: false,
      permiso: "Ver cuentas contables",
    },
    {
      text: "Per. Contables",
      icon: "fa-solid fa-calendar-days",
      url: "/Periodos-Contables-Management",
      disable: false,
    },
  ],
  nameUser: "Administrador",
};

export default navBarData;
