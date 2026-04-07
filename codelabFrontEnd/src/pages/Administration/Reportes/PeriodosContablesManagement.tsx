import { useEffect, useMemo, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRotateLeft,
  faCalendarCheck,
  faCalendarDays,
  faCircleCheck,
  faClockRotateLeft,
  faFilter,
  faFloppyDisk,
  faLock,
  faPenToSquare,
  faPlus,
  faTriangleExclamation,
} from "@fortawesome/free-solid-svg-icons";
import { toast } from "sonner";
import HeaderTitleAdmin from "../../../components/headers/HeaderAdmin";
import CardTotalComponent from "../../../components/cardTotalComponent/CardTotalComponent";
import useAuth from "../../../hooks/useAuth";
import useListPeriodosContables from "../../../hooks/PeriodosContablesHooks/useListPeriodosContables";
import useCreatePeriodoContable from "../../../hooks/PeriodosContablesHooks/useCreatePeriodoContable";
import useUpdatePeriodoContable from "../../../hooks/PeriodosContablesHooks/useUpdatePeriodoContable";
import useCerrarPeriodoContable from "../../../hooks/PeriodosContablesHooks/useCerrarPeriodoContable";
import useListSucursales from "../../../hooks/SucursalesHooks/useListSucursales";
import type { HeaderAdmin } from "../../../interfaces/Headers/HeaderInterface";
import type {
  PeriodoContable,
  PeriodoContableFormData,
} from "../../../interfaces/PeriodosContables/PeriodoContableInterface";
import {
  canClosePeriodoContableByRole,
  formatPeriodoDate,
  formatPeriodoRango,
  getTipoPeriodoLabel,
  isPeriodoContableClosedError,
} from "../../../utils/periodosContables";

type EstadoFiltro = "TODOS" | "ABIERTO" | "CERRADO";

const headerData: HeaderAdmin = {
  title: "Gestion de Periodos Contables",
  subTitle: "Controla periodos abiertos y cerrados por sucursal para proteger la integridad contable.",
};

const initialFormState: PeriodoContableFormData = {
  sucursalId: "",
  fechaInicio: "",
  fechaFin: "",
};

const normalizeText = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase();

const formatDateInput = (value: string) => value.slice(0, 10);

const rangesOverlap = (
  leftStart: string,
  leftEnd: string,
  rightStart: string,
  rightEnd: string,
) => leftStart <= rightEnd && rightStart <= leftEnd;

const statusBadgeClassName = {
  ABIERTO: "bg-[#e8f8f2] text-[#127a52]",
  CERRADO: "bg-[#fff4df] text-[#b7791f]",
};

const actionButtonClassName =
  "inline-flex cursor-pointer items-center justify-center gap-2 rounded-2xl px-4 py-2 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-60";

const pillClassName = "inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-semibold whitespace-nowrap";

export default function PeriodosContablesManagement() {
  const { user } = useAuth();
  const sucursalesQuery = useListSucursales();
  const periodosQuery = useListPeriodosContables();
  const createPeriodoMutation = useCreatePeriodoContable();
  const updatePeriodoMutation = useUpdatePeriodoContable();
  const cerrarPeriodoMutation = useCerrarPeriodoContable();

  const [formState, setFormState] = useState<PeriodoContableFormData>(initialFormState);
  const [editingId, setEditingId] = useState("");
  const [search, setSearch] = useState("");
  const [estadoFiltro, setEstadoFiltro] = useState<EstadoFiltro>("TODOS");
  const [sucursalFiltro, setSucursalFiltro] = useState("");
  const submitButtonRef = useRef<HTMLButtonElement | null>(null);

  const sucursales = useMemo(() => sucursalesQuery.data?.data ?? [], [sucursalesQuery.data?.data]);
  const periodos = useMemo(() => periodosQuery.data?.data ?? [], [periodosQuery.data?.data]);
  const defaultSucursalId = user?.sucursal.id ?? sucursales[0]?.id ?? "";
  const effectiveSucursalId = formState.sucursalId || defaultSucursalId;
  const canClosePeriods = canClosePeriodoContableByRole(user?.rol.nombre);

  useEffect(() => {
    if (!editingId || !submitButtonRef.current) {
      return;
    }

    submitButtonRef.current.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  }, [editingId]);

  const invalidDateRange = Boolean(
    formState.fechaInicio
    && formState.fechaFin
    && formState.fechaInicio > formState.fechaFin,
  );

  const overlappingPeriodo = useMemo(
    () =>
      periodos.find((periodo) =>
        Boolean(
          effectiveSucursalId
          && formState.fechaInicio
          && formState.fechaFin
          && periodo.sucursalId === effectiveSucursalId
          && periodo.id !== editingId
          && rangesOverlap(
            formatDateInput(periodo.fechaInicio),
            formatDateInput(periodo.fechaFin),
            formState.fechaInicio,
            formState.fechaFin,
          ),
        )),
    [editingId, effectiveSucursalId, formState.fechaFin, formState.fechaInicio, periodos],
  );

  const filteredPeriodos = useMemo(() => {
    const term = normalizeText(search);

    return periodos.filter((periodo) => {
      const matchesSucursal = !sucursalFiltro || periodo.sucursalId === sucursalFiltro;
      const matchesEstado = estadoFiltro === "TODOS" || periodo.estado === estadoFiltro;
      const matchesSearch =
        !term
        || normalizeText(periodo.sucursalNombre).includes(term)
        || normalizeText(periodo.estado).includes(term)
        || normalizeText(periodo.fechaInicio).includes(term)
        || normalizeText(periodo.fechaFin).includes(term)
        || normalizeText(getTipoPeriodoLabel(periodo.tipo)).includes(term);

      return matchesSucursal && matchesEstado && matchesSearch;
    });
  }, [estadoFiltro, periodos, search, sucursalFiltro]);

  const activePeriodos = useMemo(
    () => periodos.filter((periodo) => periodo.activo),
    [periodos],
  );

  const totalAbiertos = periodos.filter((periodo) => periodo.estado === "ABIERTO").length;
  const totalCerrados = periodos.filter((periodo) => periodo.estado === "CERRADO").length;

  const resetForm = () => {
    setEditingId("");
    setFormState({
      ...initialFormState,
      sucursalId: defaultSucursalId,
    });
  };

  const handleEdit = (periodo: PeriodoContable) => {
    setEditingId(periodo.id);
    setFormState({
      sucursalId: periodo.sucursalId,
      fechaInicio: formatDateInput(periodo.fechaInicio),
      fechaFin: formatDateInput(periodo.fechaFin),
    });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (invalidDateRange) {
      toast.error("El rango de fechas no es valido.");
      return;
    }

    if (overlappingPeriodo) {
      toast.error("Ya existe un periodo superpuesto en esta sucursal.", {
        description: `${overlappingPeriodo.sucursalNombre}: ${formatPeriodoRango(overlappingPeriodo)}`,
      });
      return;
    }

    try {
      const payload = {
        ...formState,
        sucursalId: effectiveSucursalId,
      };

      const response = editingId
        ? await updatePeriodoMutation.mutateAsync({
          id: editingId,
          ...payload,
        })
        : await createPeriodoMutation.mutateAsync(payload);

      toast.success(
        response.message
        || (editingId
          ? "Periodo contable actualizado correctamente."
          : "Periodo contable creado correctamente."),
      );
      resetForm();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "No se pudo guardar el periodo.");
    }
  };

  const handleCerrarPeriodo = async (periodo: PeriodoContable) => {
    if (!canClosePeriods) {
      toast.error("Solo administrador o contador pueden cerrar periodos contables.");
      return;
    }

    const confirmed = window.confirm(
      `Vas a cerrar el periodo de ${periodo.sucursalNombre} (${formatPeriodoRango(periodo)}). Una vez cerrado no se permitiran nuevos registros ni modificaciones. Deseas continuar?`,
    );

    if (!confirmed) {
      return;
    }

    try {
      const response = await cerrarPeriodoMutation.mutateAsync({
        id: periodo.id,
        usuarioCierreId: user?.id ?? "",
      });
      toast.success(response.message || "Periodo contable cerrado correctamente.");

      if (editingId === periodo.id) {
        resetForm();
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "No se pudo cerrar el periodo contable.";
      toast.error(message, {
        description: isPeriodoContableClosedError(message)
          ? "El backend reporto una restriccion asociada al estado del periodo."
          : "Verifica si existen asientos descuadrados o reglas pendientes antes del cierre.",
      });
    }
  };

  return (
    <section className="p-6 h-full">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex items-start gap-4">
          <div className="rounded-[28px] bg-linear-to-br from-[#109c9a] to-[#4a6eb0] p-5 shadow-[0_10px_24px_rgba(10,64,89,0.16)]">
            <FontAwesomeIcon icon={faCalendarDays} className="text-4xl text-white" />
          </div>
          <HeaderTitleAdmin {...headerData} />
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          <CardTotalComponent
            title="Total de periodos"
            total={periodos.length}
            colorNumber="text-[#0a4d76]"
          />
          <CardTotalComponent
            title="Periodos abiertos"
            total={totalAbiertos}
            colorNumber="text-[#109c9a]"
          />
          <CardTotalComponent
            title="Periodos cerrados"
            total={totalCerrados}
            colorNumber="text-[#b7791f]"
          />
          <CardTotalComponent
            title="Periodos activos"
            total={activePeriodos.length}
            colorNumber="text-[#2f67ff]"
          />
        </div>

        <div className="overflow-hidden rounded-[30px] mt-8 bg-linear-to-br from-[#0b4d77] via-[#18638b] to-[#11a2a5] p-6 text-white shadow-[0_14px_38px_rgba(10,64,89,0.14)]">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-white/75">Periodo activo</p>
              <h3 className="mt-3 text-3xl font-bold">Estado actual del sistema</h3>
            </div>
            <div className="shrink-0 rounded-2xl bg-white/12 p-4 text-2xl">
              <FontAwesomeIcon icon={faCalendarCheck} />
            </div>
          </div>

          <div className="mt-8 space-y-4">
            {activePeriodos.length > 0 ? activePeriodos.map((periodo) => (
              <div key={periodo.id} className="rounded-2xl bg-white/10 p-4">
                <p className="text-sm text-white/75">{periodo.sucursalNombre}</p>
                <p className="mt-2 text-xl font-semibold">{formatPeriodoRango(periodo)}</p>
                <p className="mt-2 text-sm text-white/75">
                  {getTipoPeriodoLabel(periodo.tipo)} - {periodo.estado.toLowerCase()}
                </p>
              </div>
            )) : (
              <div className="rounded-2xl bg-white/10 p-4">
                <p className="text-xl font-semibold">No hay un periodo activo detectado.</p>
                <p className="mt-2 text-sm text-white/75">
                  Verifica que exista un periodo abierto cuya fecha actual este dentro del rango configurado.
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 grid gap-6 2xl:grid-cols-[minmax(0,1.85fr)_minmax(360px,1fr)]">
          <div className="rounded-[30px] bg-white p-6 shadow-[0_12px_34px_rgba(10,64,89,0.10)]">
            <div className="flex flex-col gap-4 border-b border-[#dbe5ef] pb-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-[#eef6fb] p-4 text-[#4a6eb0]">
                  <FontAwesomeIcon icon={faFilter} className="text-2xl" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-[#0b4d77]">Listado de periodos contables</h3>
                  <p className="text-base text-[#4661b0]">
                    Filtra por sucursal, estado o texto y revisa que sucursal tiene el periodo activo.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setEstadoFiltro("TODOS");
                  setSucursalFiltro("");
                }}
                className="inline-flex cursor-pointer items-center justify-center gap-3 rounded-2xl border border-[#9adce2] px-5 py-3 text-base font-semibold text-[#0aa6a2] hover:bg-[#effafa]"
              >
                <FontAwesomeIcon icon={faArrowRotateLeft} />
                Limpiar filtros
              </button>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-3">
              <label className="flex flex-col gap-3 md:col-span-2">
                <span className="text-base font-semibold text-[#0b4d77]">Buscar</span>
                <input
                  type="text"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Sucursal, estado o fecha..."
                  className="rounded-2xl border border-[#cddaea] bg-white px-4 py-4 text-lg text-[#1f3f70] outline-none"
                />
              </label>

              <label className="flex flex-col gap-3">
                <span className="text-base font-semibold text-[#0b4d77]">Estado</span>
                <select
                  value={estadoFiltro}
                  onChange={(event) => setEstadoFiltro(event.target.value as EstadoFiltro)}
                  className="rounded-2xl border border-[#cddaea] bg-white px-4 py-4 text-lg text-[#1f3f70] outline-none"
                >
                  <option value="TODOS">Todos</option>
                  <option value="ABIERTO">Abiertos</option>
                  <option value="CERRADO">Cerrados</option>
                </select>
              </label>

              <label className="flex flex-col gap-3 md:col-span-3">
                <span className="text-base font-semibold text-[#0b4d77]">Sucursal</span>
                <select
                  value={sucursalFiltro}
                  onChange={(event) => setSucursalFiltro(event.target.value)}
                  className="rounded-2xl border border-[#cddaea] bg-white px-4 py-4 text-lg text-[#1f3f70] outline-none"
                >
                  <option value="">Todas las sucursales</option>
                  {sucursales.map((sucursal) => (
                    <option key={sucursal.id} value={sucursal.id}>
                      {sucursal.nombre}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div className="mt-6 overflow-hidden rounded-[24px] border border-[#dbe5ef]">
              {periodosQuery.isLoading ? (
                <div className="rounded-[24px] bg-[#f8fbff] px-6 py-10 text-lg font-semibold text-[#4661b0]">
                  Cargando periodos contables...
                </div>
              ) : periodosQuery.isError ? (
                <div className="rounded-[24px] bg-[#fff5f5] px-6 py-10 text-lg font-semibold text-[#b54747]">
                  {periodosQuery.error?.message || "No se pudo cargar la lista de periodos contables."}
                </div>
              ) : filteredPeriodos.length === 0 ? (
                <div className="rounded-[24px] bg-[#f8fbff] px-6 py-10 text-lg font-semibold text-[#4661b0]">
                  No hay periodos contables para los filtros seleccionados.
                </div>
              ) : (
                <>
                  <div className="grid gap-4 p-4 lg:hidden">
                    {filteredPeriodos.map((periodo) => (
                      <article
                        key={periodo.id}
                        className="rounded-[24px] border border-[#e4edf8] bg-white p-5 shadow-[0_8px_22px_rgba(10,64,89,0.06)]"
                      >
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div>
                            <p className="text-lg font-semibold text-[#0b3f70]">{periodo.sucursalNombre}</p>
                            <p className="mt-1 text-sm text-[#6a7ea6]">Sucursal ID: {periodo.sucursalId || "N/A"}</p>
                          </div>
                          <span className={`${pillClassName} ${statusBadgeClassName[periodo.estado]}`}>
                            {periodo.estado === "ABIERTO" ? "Abierto" : "Cerrado"}
                          </span>
                        </div>

                        <div className="mt-4 grid gap-4 sm:grid-cols-2">
                          <div className="rounded-2xl bg-[#f8fbff] p-4">
                            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#6a7ea6]">Rango</p>
                            <p className="mt-2 text-base font-semibold leading-6 text-[#1f3f70]">
                              {formatPeriodoRango(periodo)}
                            </p>
                            <div className="mt-3 space-y-1 text-sm text-[#6a7ea6]">
                              <p>Inicio: {formatPeriodoDate(periodo.fechaInicio)}</p>
                              <p>Fin: {formatPeriodoDate(periodo.fechaFin)}</p>
                            </div>
                          </div>

                          <div className="space-y-3 rounded-2xl bg-[#fbfdff] p-4">
                            <div>
                              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#6a7ea6]">Tipo</p>
                              <span className={`${pillClassName} mt-2 bg-[#eef6fb] text-[#2c5aa0]`}>
                                {getTipoPeriodoLabel(periodo.tipo)}
                              </span>
                            </div>

                            <div>
                              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#6a7ea6]">Activo</p>
                              {periodo.activo ? (
                                <span className={`${pillClassName} mt-2 bg-[#e8f8f2] text-[#127a52]`}>
                                  <FontAwesomeIcon icon={faCircleCheck} />
                                  Activo
                                </span>
                              ) : (
                                <span className={`${pillClassName} mt-2 bg-[#edf3fb] text-[#4661b0]`}>
                                  Fuera de vigencia
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="mt-4 rounded-2xl bg-[#f8fbff] p-4 text-sm text-[#1f3f70]">
                          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#6a7ea6]">Cierre</p>
                          {periodo.fechaCierre ? (
                            <div className="mt-2">
                              <p className="font-semibold">{formatPeriodoDate(periodo.fechaCierre)}</p>
                              <p className="mt-1 text-[#6a7ea6]">{periodo.usuarioCierreNombre || "Usuario no disponible"}</p>
                            </div>
                          ) : (
                            <p className="mt-2 font-semibold text-[#4661b0]">Pendiente</p>
                          )}
                        </div>

                        <div className="mt-4 flex flex-wrap gap-2">
                          <button
                            type="button"
                            onClick={() => handleEdit(periodo)}
                            disabled={periodo.estado === "CERRADO"}
                            className={`${actionButtonClassName} flex-1 bg-[#eff6ff] text-[#2c5aa0] hover:bg-[#dcecff]`}
                          >
                            <FontAwesomeIcon icon={faPenToSquare} />
                            Editar
                          </button>
                          <button
                            type="button"
                            onClick={() => void handleCerrarPeriodo(periodo)}
                            disabled={
                              periodo.estado === "CERRADO"
                              || !canClosePeriods
                              || cerrarPeriodoMutation.isPending
                            }
                            className={`${actionButtonClassName} flex-1 bg-[#fff4df] text-[#a36513] hover:bg-[#ffe7ba]`}
                          >
                            <FontAwesomeIcon icon={faLock} />
                            Cerrar
                          </button>
                        </div>
                      </article>
                    ))}
                  </div>

                  <div className="hidden overflow-x-auto lg:block">
                    <table className="min-w-[1100px] table-fixed text-left">
                      <colgroup>
                        <col className="w-[18%]" />
                        <col className="w-[25%]" />
                        <col className="w-[12%]" />
                        <col className="w-[12%]" />
                        <col className="w-[14%]" />
                        <col className="w-[11%]" />
                        <col className="w-[18%]" />
                      </colgroup>
                      <thead>
                        <tr className="bg-linear-to-r from-[#109c9a] to-[#4a6eb0] text-white">
                          <th className="px-5 py-4 text-sm font-semibold uppercase tracking-wide whitespace-nowrap">Sucursal</th>
                          <th className="px-5 py-4 text-sm font-semibold uppercase tracking-wide whitespace-nowrap">Rango</th>
                          <th className="px-5 py-4 text-sm font-semibold uppercase tracking-wide whitespace-nowrap">Tipo</th>
                          <th className="px-5 py-4 text-sm font-semibold uppercase tracking-wide whitespace-nowrap">Estado</th>
                          <th className="px-5 py-4 text-sm font-semibold uppercase tracking-wide whitespace-nowrap">Activo</th>
                          <th className="px-5 py-4 text-sm font-semibold uppercase tracking-wide whitespace-nowrap">Cierre</th>
                          <th className="px-5 py-4 text-sm font-semibold uppercase tracking-wide whitespace-nowrap">Acciones</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredPeriodos.map((periodo) => (
                          <tr
                            key={periodo.id}
                            className="border-b border-[#edf3fb] bg-white align-top hover:bg-[#f8fbff]"
                          >
                            <td className="px-5 py-5">
                              <div className="space-y-1">
                                <div className="font-semibold text-[#0b3f70]">{periodo.sucursalNombre}</div>
                                <div className="text-sm text-[#6a7ea6]">ID: {periodo.sucursalId || "N/A"}</div>
                              </div>
                            </td>
                            <td className="px-5 py-5 text-[#1f3f70]">
                              <div className="rounded-2xl bg-[#f8fbff] p-4">
                                <div className="font-semibold leading-6">{formatPeriodoRango(periodo)}</div>
                                <div className="mt-3 space-y-1 text-sm text-[#6a7ea6]">
                                  <div>Inicio: {formatPeriodoDate(periodo.fechaInicio)}</div>
                                  <div>Fin: {formatPeriodoDate(periodo.fechaFin)}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-5 py-5">
                              <span className={`${pillClassName} bg-[#eef6fb] text-[#2c5aa0]`}>
                                {getTipoPeriodoLabel(periodo.tipo)}
                              </span>
                            </td>
                            <td className="px-5 py-5">
                              <span className={`${pillClassName} ${statusBadgeClassName[periodo.estado]}`}>
                                {periodo.estado === "ABIERTO" ? "Abierto" : "Cerrado"}
                              </span>
                            </td>
                            <td className="px-5 py-5">
                              {periodo.activo ? (
                                <span className={`${pillClassName} bg-[#e8f8f2] text-[#127a52]`}>
                                  <FontAwesomeIcon icon={faCircleCheck} />
                                  Activo
                                </span>
                              ) : (
                                <span className={`${pillClassName} bg-[#edf3fb] text-[#4661b0]`}>
                                  Fuera de vigencia
                                </span>
                              )}
                            </td>
                            <td className="px-5 py-5 text-[#1f3f70]">
                              {periodo.fechaCierre ? (
                                <div className="space-y-1">
                                  <div className="font-semibold">{formatPeriodoDate(periodo.fechaCierre)}</div>
                                  <div className="text-sm text-[#6a7ea6]">
                                    {periodo.usuarioCierreNombre || "Usuario no disponible"}
                                  </div>
                                </div>
                              ) : (
                                <span className="text-sm font-semibold text-[#4661b0]">Pendiente</span>
                              )}
                            </td>
                            <td className="px-5 py-5">
                              <div className="flex flex-wrap gap-2">
                                <button
                                  type="button"
                                  onClick={() => handleEdit(periodo)}
                                  disabled={periodo.estado === "CERRADO"}
                                  className={`${actionButtonClassName} bg-[#eff6ff] text-[#2c5aa0] hover:bg-[#dcecff] whitespace-nowrap`}
                                >
                                  <FontAwesomeIcon icon={faPenToSquare} />
                                  Editar
                                </button>
                                <button
                                  type="button"
                                  onClick={() => void handleCerrarPeriodo(periodo)}
                                  disabled={
                                    periodo.estado === "CERRADO"
                                    || !canClosePeriods
                                    || cerrarPeriodoMutation.isPending
                                  }
                                  className={`${actionButtonClassName} bg-[#fff4df] text-[#a36513] hover:bg-[#ffe7ba] whitespace-nowrap`}
                                >
                                  <FontAwesomeIcon icon={faLock} />
                                  Cerrar
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="space-y-6">


            <form
              onSubmit={(event) => void handleSubmit(event)}
              className="rounded-[30px] bg-white p-6 shadow-[0_12px_34px_rgba(10,64,89,0.10)]"
            >
              <div className="flex items-center gap-3 border-b border-[#dbe5ef] pb-6">
                <div className="rounded-2xl bg-[#eef6fb] p-4 text-[#4a6eb0]">
                  <FontAwesomeIcon icon={editingId ? faPenToSquare : faPlus} className="text-2xl" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-[#0b4d77]">
                    {editingId ? "Editar periodo contable" : "Nuevo periodo contable"}
                  </h3>
                  <p className="text-base text-[#4661b0]">
                    Define sucursal, fecha de inicio y fecha de fin para controlar los registros financieros.
                  </p>
                </div>
              </div>

              <div className="mt-6 space-y-5">
                <label className="flex flex-col gap-3">
                  <span className="text-base font-semibold text-[#0b4d77]">Sucursal</span>
                  <select
                    required
                    value={effectiveSucursalId}
                    onChange={(event) =>
                      setFormState((prev) => ({ ...prev, sucursalId: event.target.value }))}
                    className="rounded-2xl border border-[#cddaea] bg-white px-4 py-4 text-lg text-[#1f3f70] outline-none"
                  >
                    <option value="">Selecciona una sucursal</option>
                    {sucursales.map((sucursal) => (
                      <option key={sucursal.id} value={sucursal.id}>
                        {sucursal.nombre}
                      </option>
                    ))}
                  </select>
                </label>

                <div className="grid gap-5 md:grid-cols-2">
                  <label className="flex flex-col gap-3">
                    <span className="text-base font-semibold text-[#0b4d77]">Fecha de inicio</span>
                    <input
                      required
                      type="date"
                      value={formState.fechaInicio}
                      onChange={(event) =>
                        setFormState((prev) => ({ ...prev, fechaInicio: event.target.value }))}
                      className="rounded-2xl border border-[#cddaea] bg-white px-4 py-4 text-lg text-[#1f3f70] outline-none"
                    />
                  </label>

                  <label className="flex flex-col gap-3">
                    <span className="text-base font-semibold text-[#0b4d77]">Fecha de fin</span>
                    <input
                      required
                      type="date"
                      value={formState.fechaFin}
                      onChange={(event) =>
                        setFormState((prev) => ({ ...prev, fechaFin: event.target.value }))}
                      className="rounded-2xl border border-[#cddaea] bg-white px-4 py-4 text-lg text-[#1f3f70] outline-none"
                    />
                  </label>
                </div>

                {invalidDateRange && (
                  <div className="rounded-2xl border border-[#f2c1c1] bg-[#fff5f5] px-5 py-4 text-base text-[#b54747]">
                    La fecha de inicio no puede ser mayor que la fecha de fin.
                  </div>
                )}

                {overlappingPeriodo && !invalidDateRange && (
                  <div className="rounded-2xl border border-[#f6d48b] bg-[#fff8e6] px-5 py-4 text-base text-[#9a6700]">
                    Existe un periodo superpuesto para esta sucursal: {formatPeriodoRango(overlappingPeriodo)}.
                  </div>
                )}

                <div className="rounded-2xl bg-[#f8fbff] p-5">
                  <div className="flex items-start gap-3">
                    <FontAwesomeIcon icon={faTriangleExclamation} className="pt-1 text-lg text-[#d08700]" />
                    <div className="space-y-2 text-sm text-[#4661b0]">
                      <p>Solo se deben registrar movimientos contables en periodos abiertos.</p>
                      <p>El cierre del periodo queda restringido a roles de administrador o contador.</p>
                    </div>
                  </div>
                </div>

                {!canClosePeriods && (
                  <div className="rounded-2xl border border-[#d8e4f3] bg-[#eef6fb] px-5 py-4 text-base text-[#2c5aa0]">
                    Tu rol actual es <span className="font-semibold">{user?.rol.nombre || "Sin rol"}</span>.
                    Puedes crear y consultar periodos, pero el cierre esta reservado para administrador o contador.
                  </div>
                )}
              </div>

              <div className="mt-6 grid gap-3 md:grid-cols-2">
                <button
                  type="button"
                  onClick={resetForm}
                  className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-2xl border border-[#9adce2] px-5 py-3 text-base font-semibold text-[#0aa6a2] hover:bg-[#effafa]"
                >
                  <FontAwesomeIcon icon={faClockRotateLeft} />
                  Cancelar edicion
                </button>
                <button
                  type="submit"
                  ref={submitButtonRef}
                  disabled={
                    createPeriodoMutation.isPending
                    || updatePeriodoMutation.isPending
                    || invalidDateRange
                    || Boolean(overlappingPeriodo)
                  }
                  className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-2xl bg-linear-to-r from-[#109c9a] to-[#4a6eb0] px-5 py-3 text-base font-semibold text-white shadow-[0_10px_24px_rgba(10,64,89,0.12)] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <FontAwesomeIcon icon={editingId ? faFloppyDisk : faPlus} />
                  {createPeriodoMutation.isPending || updatePeriodoMutation.isPending
                    ? "Guardando..."
                    : editingId
                      ? "Actualizar periodo"
                      : "Crear periodo"}
                </button>
              </div>
            </form>


          </div>
        </div>
      </div>
    </section>
  );
}
