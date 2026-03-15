import type { TableComponentProps } from "../../interfaces/TablaInterface/Itabla";

export default function TableComponent({
  tituloTablaInventario,
  contenidoTabla,
}: Readonly<TableComponentProps>) {
  return (
    <div className="mt-6 rounded-xl overflow-x-auto shadow-[0_6px_18px_rgba(10,64,89,0.08)]">
      <table className="w-full text-sm min-w-175">
        <thead>
          <tr className="bg-linear-to-r from-[#0aa6a2] to-[#4661b0] text-white">
            {tituloTablaInventario.map((col) => (
              <th
                key={col}
                className="px-4 py-3 text-left font-semibold tracking-wide whitespace-nowrap"
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{contenidoTabla}</tbody>
      </table>
    </div>
  );
}
