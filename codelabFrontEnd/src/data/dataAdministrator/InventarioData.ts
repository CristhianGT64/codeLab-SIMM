import type { ButtonsInterface } from "../../interfaces/ButtonInterface/ButtonsInterface";
import type { HeaderAdmin } from "../../interfaces/Headers/HeaderInterface";
import type { FiltroTipo } from "../../interfaces/Inventario/InventarioInterface";

export const titleInventario: HeaderAdmin = {
  title: "Movimientos de Inventario",
  subTitle: "Gestiona las entradas y salidas de productos",
};

export const botonRegistrarEntrada: ButtonsInterface = {
  text: "Registrar Entrada",
  typeButton: "button",
  className:
    "flex-1 flex items-center justify-center gap-2 py-3 px-6 rounded-xl text-white font-semibold text-base bg-linear-to-r from-[#0aa6a2] to-[#4661b0] hover:from-[#034d4a] hover:to-[#2c3d70] shadow-md transition-all duration-200",
  icon: "fa-solid fa-plus",
  onClick: () => {},
  disabled: false,
};

export const botonRegistrarSalida: ButtonsInterface = {
  text: "Registrar Salida",
  typeButton: "button",
  className:
    "flex-1 flex items-center justify-center gap-2 py-3 px-6 rounded-xl font-semibold text-base border-2 border-[#9adce2] text-[#4661b0] bg-white hover:bg-[#edf8fa] transition-all duration-200",
  icon: "fa-solid fa-minus",
  onClick: () => {},
  disabled: false,
};

export const botonBorrarFiltro: ButtonsInterface = {
  text: "Limpiar filtros",
  typeButton: "button",
  className:
    "cursor-pointer py-2.5 px-5 text-sm text-[#4661b0] border-2 border-[#9adce2] rounded-lg hover:bg-[#edf8fa] transition-colors whitespace-nowrap",
  icon: "",
  onClick: () => {},
  disabled: false,
};

export const tituloTablaInventario: string[] = [
  "Fecha",
  "Producto",
  "Tipo",
  "Cantidad",
  "Proveedor/Motivo",
  "Stock Resultante",
  "Estado",
];

export const filtroTipo : FiltroTipo[] = [
    {
        valor: '',
        nombre : 'Todos los tipos'
    },
    {
        valor: 'entrada',
        nombre : 'Entrada'
    },
    {
        valor: 'salida',
        nombre : 'Salida'
    },
] 




