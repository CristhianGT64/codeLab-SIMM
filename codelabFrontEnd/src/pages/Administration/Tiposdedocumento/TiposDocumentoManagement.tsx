import { useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEye,
  faMagnifyingGlass,
  faPenToSquare,
  faPowerOff,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import ButtonsComponet from "../../../components/buttonsComponents/ButtonsComponet";
import CardTotalComponent from "../../../components/cardTotalComponent/CardTotalComponent";
import StatusNotification from "../../../components/notifications/StatusNotification";
import {
  NotificacionData,
  type NotificationStateInterface,
} from "../../../interfaces/NotificacionesInterface";
import useAuth from "../../../hooks/useAuth";
import useListTiposDocumento from "../../../hooks/TiposDocumentoHooks/useListTiposDocumento";
import useChangeTipoDocumentoStatus from "../../../hooks/TiposDocumentoHooks/useChangeTipoDocumentoStatus";
import type { TipoDocumento } from "../../../interfaces/TipodedocumentoInterface/TipoDocumentoInterface";

type EstadoFiltro = "todos" | "activos" | "inactivos";

export default function TiposDocumentoManagement() {
  const navigate = useNavigate();
  const { tienePermiso } = useAuth();
  const { data, isLoading, isError } = useListTiposDocumento();
  const { mutateAsync: toggleEstado, isPending: isChangingStatus } =
    useChangeTipoDocumentoStatus();

  const [search, setSearch] = useState("");
  const [estadoFiltro, setEstadoFiltro] = useState<EstadoFiltro>("todos");
  const [tipoSeleccionado, setTipoSeleccionado] = useState<TipoDocumento | null>(
    null,
  );
  const [tipoConfirmacion, setTipoConfirmacion] = useState<TipoDocumento | null>(
    null,
  );
  const [notification, setNotification] =
    useState<NotificationStateInterface>(NotificacionData);

  const tiposDocumento = Array.isArray(data?.data) ? data.data : [];

  const total = tiposDocumento.length;
  const activos = tiposDocumento.filter((item) => item.activo).length;
  const inactivos = total - activos;
  const requierenCai = tiposDocumento.filter((item) => item.requiereCai).length;

  const tiposFiltrados = useMemo(() => {
    const term = search.trim().toLowerCase();

    return tiposDocumento
      .filter((item) => {
        const codigo = String(item.codigo ?? "").toLowerCase();
        const nombre = String(item.nombre ?? "").toLowerCase();
        const descripcion = String(item.descripcion ?? "").toLowerCase();

        const coincideTexto =
          codigo.includes(term) || nombre.includes(term) || descripcion.includes(term);

        if (!coincideTexto) {
          return false;
        }

        if (estadoFiltro === "activos") {
          return item.activo;
        }

        if (estadoFiltro === "inactivos") {
          return !item.activo;
        }

        return true;
      })
      .sort((a, b) => Number(b.activo) - Number(a.activo));
  }, [estadoFiltro, search, tiposDocumento]);

  const closeNotification = () => {
    setNotification((prev) => ({ ...prev, isVisible: false }));
  };

  const confirmarCambioEstado = async () => {
    if (!tipoConfirmacion) {
      return;
    }

    try {
      await toggleEstado(tipoConfirmacion.id);
      setTipoConfirmacion(null);

      setNotification({
        isVisible: true,
        variant: "success",
        title: "Estado actualizado",
        message: `El tipo de documento ${tipoConfirmacion.codigo} fue actualizado correctamente.`,
      });
    } catch {
      setNotification({
        isVisible: true,
        variant: "error",
        title: "No se pudo actualizar",
        message: "No se pudo cambiar el estado del tipo de documento.",
      });
    }
  };

  return (
    <section className="w-full px-4 py-5 md:px-6 bg-[#f3f5f8]">
      <header className="flex flex-col gap-4">
        <h2 className="text-3xl font-bold text-[#0b4d77] md:text-4xl">
          Tipos de Documento
        </h2>
        <p className="text-lg text-[#4661b0] md:text-xl">
          Configura los tipos de documento para facturacion y operaciones
        </p>
      </header>

      <div className="mt-6 rounded-2xl bg-[#f3f5f8] p-4 shadow-[0_6px_18px_rgba(0,0,0,0.08)]">
        <div className="flex gap-4 items-center">
          <label className="flex flex-1 h-11 items-center gap-3 rounded-xl border-2 border-[#9adce2] bg-white px-4">
            <FontAwesomeIcon
              icon={faMagnifyingGlass}
              className="text-lg text-[#9adce2]"
            />
            <input
              type="text"
              placeholder="Buscar por codigo, nombre o descripcion..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="w-full bg-transparent text-base text-[#6a758f] placeholder:text-[#8891a7] outline-none md:text-lg"
            />
          </label>

          <select
            value={estadoFiltro}
            onChange={(event) => setEstadoFiltro(event.target.value as EstadoFiltro)}
            className="h-11 w-48 rounded-xl border-2 border-[#9adce2] bg-white px-4 text-base text-[#24364d] outline-none focus:border-[#0aa6a2] md:text-lg"
          >
            <option value="todos">Todos los estados</option>
            <option value="activos">Solo activos</option>
            <option value="inactivos">Solo inactivos</option>
          </select>
          {tienePermiso("Crear tipos de documento") && (
            <ButtonsComponet
              text="Nuevo Tipo de Documento"
              typeButton="button"
              className="cursor-pointer flex h-11 items-center justify-center gap-2 rounded-xl bg-linear-to-r from-[#0aa6a2] to-[#4661b0] hover:from-[#034d4a] hover:to-[#2c3d70] px-6 text-base font-semibold text-white md:text-lg whitespace-nowrap"
              icon="fa-solid fa-plus"
              onClick={() => navigate("/Tipos-Documento-Management/Create")}
              disabled={false}
            />
          )}
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-4">
        <CardTotalComponent
          title="Total Tipos"
          total={total}
          colorNumber="text-[#0a4d76]"
        />
        <CardTotalComponent
          title="Activos"
          total={activos}
          colorNumber="text-[#009b3a]"
        />
        <CardTotalComponent
          title="Inactivos"
          total={inactivos}
          colorNumber="text-[#e10000]"
        />
        <CardTotalComponent
          title="Requieren CAI"
          total={requierenCai}
          colorNumber="text-[#0aa6a2]"
        />
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl bg-white shadow-[0_8px_18px_rgba(0,0,0,0.08)]">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-linear-to-r from-[#0aa6a2] to-[#4661b0] text-left text-white">
              <th className="px-6 py-4 text-base font-semibold">Código</th>
              <th className="px-4 py-4 text-base font-semibold">Nombre del documento</th>
              <th className="px-4 py-4 text-base font-semibold">Prefijo</th>
              <th className="px-4 py-4 text-base font-semibold">Núm de CAI</th>
              <th className="px-4 py-4 text-base font-semibold">Estado</th>
              <th className="px-4 py-4 text-base font-semibold">Ultima Actividad</th>
              <th className="px-4 py-4 text-base font-semibold text-center">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody>
            {isLoading && (
              <tr>
                <td colSpan={7} className="px-6 py-6 text-center text-[#4661b0]">
                  Cargando tipos de documento...
                </td>
              </tr>
            )}

            {!isLoading && isError && (
              <tr>
                <td colSpan={7} className="px-6 py-6 text-center text-[#c20000]">
                  No se pudo cargar el listado de tipos de documento.
                </td>
              </tr>
            )}

            {!isLoading && !isError && tiposFiltrados.length === 0 && (
              <tr>
                <td colSpan={7} className="px-6 py-6 text-center text-[#6a758f]">
                  No hay tipos de documento para mostrar.
                </td>
              </tr>
            )}

            {!isLoading &&
              !isError &&
              tiposFiltrados.map((tipo) => (
                <tr
                  key={tipo.id}
                  className="border-b border-[#dbe5ef] text-[#24364d] last:border-b-0"
                >
                  <td className="px-6 py-4 text-xl font-bold text-[#1f4f88]">
                    {tipo.codigo}
                  </td>
                  <td className="px-4 py-4">
                    <p className="text-2xl font-semibold text-[#0b4d77]">{tipo.nombre}</p>
                    <p className="text-xl text-[#4661b0]">{tipo.descripcion}</p>
                  </td>
                  <td className="px-4 py-4 text-lg text-[#1f4f88]">
                    <span className="rounded-lg bg-[#e8f4f9] px-3 py-1 font-semibold">
                      {tipo.prefijoNumeracion}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <span
                      className={`inline-flex rounded-full px-4 py-1 text-base font-semibold ${
                        tipo.requiereCai
                          ? "bg-[#f9e9b6] text-[#d06800]"
                          : "bg-[#eceef2] text-[#697587]"
                      }`}
                    >
                      {tipo.requiereCai ? "Requerido" : "No requerido"}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <span
                      className={`inline-flex rounded-full px-4 py-1 text-base font-semibold ${
                        tipo.activo
                          ? "bg-[#b7e4ca] text-[#008444]"
                          : "bg-[#e8ebf0] text-[#707b8d]"
                      }`}
                    >
                      {tipo.activo ? "Activo" : "Inactivo"}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-lg text-[#4661b0]">
                    {tipo.updatedAt
                      ? new Date(tipo.updatedAt).toLocaleDateString("es-HN")
                      : "-"}
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center justify-center gap-4 text-lg">
                      <button
                        type="button"
                        className="cursor-pointer text-[#4661b0] hover:text-[#2f4876]"
                        onClick={() => setTipoSeleccionado(tipo)}
                        aria-label={`Ver detalle de ${tipo.nombre}`}
                      >
                        <FontAwesomeIcon icon={faEye} />
                      </button>

                      {tienePermiso("Editar tipos de documento") && (
                        <button
                          type="button"
                          className="cursor-pointer text-[#00a3b8] hover:text-[#007786]"
                          onClick={() =>
                            navigate(`/Tipos-Documento-Management/Update/${tipo.id}`)
                          }
                          aria-label={`Editar ${tipo.nombre}`}
                        >
                          <FontAwesomeIcon icon={faPenToSquare} />
                        </button>
                      )}

                      {tienePermiso("Editar tipos de documento") && (
                        <button
                          type="button"
                          className={`cursor-pointer ${
                            tipo.activo
                              ? "text-[#ff5e00] hover:text-[#b64402]"
                              : "text-[#24e775] hover:text-[#008444]"
                          }`}
                          onClick={() => setTipoConfirmacion(tipo)}
                          aria-label={`Cambiar estado de ${tipo.nombre}`}
                        >
                          <FontAwesomeIcon icon={faPowerOff} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {tipoSeleccionado && (
        <>
          <style>{`body { overflow: hidden; }`}</style>
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0f172a]/55 p-4">
            <div className="w-full max-w-md max-h-[70vh] overflow-hidden rounded-3xl bg-white shadow-[0_14px_36px_rgba(0,0,0,0.24)]">
            <div className="flex items-start justify-between bg-linear-to-r from-[#0aa6a2] to-[#4661b0] px-4 py-3">
              <div>
                <h3 className="text-xl font-bold text-white">
                  Detalle del Tipo de Documento
                </h3>
                <p className="mt-0.5 text-sm text-white/80">Información completa</p>
              </div>
              <button
                type="button"
                className="cursor-pointer text-xl text-white"
                onClick={() => setTipoSeleccionado(null)}
                aria-label="Cerrar modal"
              >
                <FontAwesomeIcon icon={faXmark} />
              </button>
            </div>

            <div className="grid grid-cols-1 gap-3 px-4 py-3 md:grid-cols-2">
              <div>
                <p className="text-xs text-[#4661b0] uppercase">Código</p>
                <p className="text-lg font-bold text-[#0b4d77]">{tipoSeleccionado.codigo}</p>
              </div>
              <div>
                <p className="text-xs text-[#4661b0] uppercase">Estado</p>
                <span
                  className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${
                    tipoSeleccionado.activo
                      ? "bg-[#b7e4ca] text-[#008444]"
                      : "bg-[#e8ebf0] text-[#707b8d]"
                  }`}
                >
                  {tipoSeleccionado.activo ? "Activo" : "Inactivo"}
                </span>
              </div>

              <div className="md:col-span-2">
                <p className="text-xs text-[#4661b0] uppercase">Nombre</p>
                <p className="text-base font-bold text-[#0b4d77]">{tipoSeleccionado.nombre}</p>
              </div>

              <div className="md:col-span-2">
                <p className="text-xs text-[#4661b0] uppercase">Descripción</p>
                <p className="text-sm text-[#1f4f88]">{tipoSeleccionado.descripcion}</p>
              </div>

              <div>
                <p className="text-xs text-[#4661b0] uppercase">Prefijo Numeración</p>
                <span className="inline-flex rounded-lg bg-[#e8f4f9] px-2 py-0.5 text-sm font-semibold text-[#1f4f88]">
                  {tipoSeleccionado.prefijoNumeracion}
                </span>
              </div>
              <div>
                <p className="text-xs text-[#4661b0] uppercase">Autorización Fiscal (CAI)</p>
                <span
                  className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${
                    tipoSeleccionado.requiereCai
                      ? "bg-[#f9e9b6] text-[#d06800]"
                      : "bg-[#eceef2] text-[#697587]"
                  }`}
                >
                  {tipoSeleccionado.requiereCai
                    ? "Requiere CAI"
                    : "No requiere CAI"}
                </span>
              </div>

              <div>
                <p className="text-xs text-[#4661b0] uppercase">Fecha Creación</p>
                <p className="text-sm font-semibold text-[#1f4f88]">
                  {tipoSeleccionado.createdAt
                    ? new Date(tipoSeleccionado.createdAt).toLocaleDateString("es-HN")
                    : "-"}
                </p>
              </div>
              <div>
                <p className="text-xs text-[#4661b0] uppercase">Última Actualización</p>
                <p className="text-sm font-semibold text-[#1f4f88]">
                  {tipoSeleccionado.updatedAt
                    ? new Date(tipoSeleccionado.updatedAt).toLocaleDateString("es-HN")
                    : "-"}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-2 border-t border-[#dbe5ef] px-4 py-2 md:grid-cols-2">
              <ButtonsComponet
                text="Cerrar"
                typeButton="button"
                className="h-9 cursor-pointer rounded-lg border-2 border-[#9adce2] bg-white text-sm font-semibold text-[#4661b0] hover:bg-[#edf8fa]"
                icon=""
                onClick={() => setTipoSeleccionado(null)}
                disabled={false}
              />
              {tienePermiso("Editar tipos de documento") && (
                <ButtonsComponet
                  text="Editar"
                  typeButton="button"
                  className="h-9 cursor-pointer rounded-lg bg-linear-to-r from-[#0aa6a2] to-[#4661b0] text-sm font-semibold text-white hover:from-[#06706d] hover:to-[#334c8b]"
                  icon="fa-solid fa-pen-to-square"
                  onClick={() => {
                    navigate(`/Tipos-Documento-Management/Update/${tipoSeleccionado.id}`);
                  }}
                  disabled={false}
                />
              )}
            </div>
          </div>
        </div>
        </>
      )}

      {tipoConfirmacion && (
        <>
          <style>{`body { overflow: hidden; }`}</style>
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0f172a]/55 p-4">
            <div className="w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-[0_14px_36px_rgba(0,0,0,0.24)]">
            <div className="bg-linear-to-r from-[#0aa6a2] to-[#4661b0] px-4 py-3">
              <h3 className="text-lg font-bold text-white">
                {tipoConfirmacion.activo
                  ? "Desactivar Tipo de Documento"
                  : "Activar Tipo de Documento"}
              </h3>
            </div>

            <div className="px-4 py-3">
              <p className="text-sm text-[#1f4f88]">
                {tipoConfirmacion.activo
                  ? "Este tipo de documento dejará de estar disponible en nuevas operaciones."
                  : "Este tipo de documento volverá a estar disponible en nuevas operaciones."}
              </p>

              <div className="mt-3 rounded-lg bg-[#f5f8fb] px-3 py-2 text-xs text-[#0b4d77]">
                <span className="font-semibold">Tipo de Documento:</span>{" "}
                {tipoConfirmacion.codigo} - {tipoConfirmacion.nombre}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-2 border-t border-[#dbe5ef] px-4 py-2 md:grid-cols-2">
              <ButtonsComponet
                text="Cancelar"
                typeButton="button"
                className="h-9 cursor-pointer rounded-lg border-2 border-[#9adce2] bg-white text-sm font-semibold text-[#4661b0] hover:bg-[#edf8fa]"
                icon=""
                onClick={() => setTipoConfirmacion(null)}
                disabled={isChangingStatus}
              />
              <ButtonsComponet
                text={isChangingStatus ? "Procesando..." : "Confirmar"}
                typeButton="button"
                className="h-9 cursor-pointer rounded-lg bg-linear-to-r from-[#0aa6a2] to-[#4661b0] text-sm font-semibold text-white hover:from-[#06706d] hover:to-[#334c8b] disabled:cursor-not-allowed disabled:opacity-70"
                icon=""
                onClick={() => {
                  void confirmarCambioEstado();
                }}
                disabled={isChangingStatus}
              />
            </div>
          </div>
        </div>
        </>
      )}

      <StatusNotification {...notification} onClose={closeNotification} />
    </section>
  );
}