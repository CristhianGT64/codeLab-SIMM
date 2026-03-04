import type NavBarInterface from "../../interfaces/NavBarInterface";

const navBarData: NavBarInterface = {
  nameBuild: "SIMM",
  modules: [
    {
      text: "Menú Principal",
      icon: "fa-solid fa-users",
      url : "/dashboard",
      disable : false
    },
    {
      text: "Usuarios",
      icon: "fa-solid fa-users",
      url : "/Users-Management",
      disable : false
    },
    {
      text: "Sucursales",
      icon: "fa-solid fa-building-flag",
      url : "/Branches-Management",
      disable : false
    },
    {
      text: "Productos",
      icon: "fa-solid fa-box",
      url : "/Product-Management",
      disable : false
    },
  ],
  nameUser : 'Administrador'
};

export default navBarData;
