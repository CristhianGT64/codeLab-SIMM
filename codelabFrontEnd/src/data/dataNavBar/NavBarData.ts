import type NavBarInterface from "../../interfaces/NavBarInterface";

const navBarData: NavBarInterface = {
  nameBuild: "SIMM",
  modules: [
    {
      text: "Usuario",
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
  ],
  nameUser : 'Administrador'
};

export default navBarData;
