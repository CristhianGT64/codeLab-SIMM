import {
  useMemo,
  useState,
  type ChangeEvent,
  type SyntheticEvent,
} from "react";
import HeaderTitleAdmin from "../../../components/headers/HeaderAdmin";
import {
  alertaCaiPorAgotar,
  alertaCaiRangoAgotado,
  alertaCaiVencido,
  botonGenerarNuevoCAI,
  estadoCaiProxVencer,
  estadoCaiRangoAgotado,
  estadoCaiValido,
  estadoCaiVencido,
  notificacionRangoCero,
  notificacionRangoMayor,
  notificacionRegistroCaiError,
  notificacionRegistroCaiExitoso,
  titleConfiguracionCAI,
  tituloTablaCaisEmitidos,
} from "../../../data/dataAdministrator/ConfiguracionCAIData";
import useReadCaiVigente from "../../../hooks/CaiHooks/useReadCaiVigente";
import {
  caiEmpty,
  formNuevoCaiEmpty,
  type FormNuevoCai,
  type Icai,
} from "../../../interfaces/CAI/Icai";
import EstadosObjetos from "../../../components/EstadosObjetos/EstadosObjetos";
import {
  emptyEstado,
  type IestadosObjetos,
} from "../../../interfaces/IestadosObjetos";
import AlertaComponent from "../../../components/Alertas/AlertaComponent";
import ButtonsComponet from "../../../components/buttonsComponents/ButtonsComponet";
import useListCaiEmitidos from "../../../hooks/CaiHooks/useListCaiEmitidos";
import TableComponent from "../../../components/Table/TableComponent";
import PaginacionComponent from "../../../components/Paginacion/PaginacionComponent";
import { contenidoTablaCaiEmitidos } from "../../../data/dataAdministrator/TablesData/TableConfifCaiData";
import { FormNuevoCAI } from "../../../components/Forms/FormNuevoCAI";
import useCreateCai from "../../../hooks/CaiHooks/useCreateCai";
import {
  NotificacionData,
  type NotificationStateInterface,
} from "../../../interfaces/NotificacionesInterface";
import StatusNotification from "../../../components/notifications/StatusNotification";

const ITEMS_POR_PAGINA = 4;

export default function ConfiguracionCAI() {
  const { data: CaiVigenteData, isLoading: isLoadingCaiVigente } =
    useReadCaiVigente();
  const caiVigente: Icai = CaiVigenteData?.data ?? caiEmpty;
  const fechaInicio = new Date(caiVigente.fechaInicio);
  const fechaFin = new Date(caiVigente.fechaFin);
  const { data: CaisEmitidosData, isLoading: isLoadingCaisEmitidos } =
    useListCaiEmitidos();
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const caisEmitidos: Icai[] = CaisEmitidosData?.data ?? [];
  const [paginaActual, setPaginaActual] = useState(1);
  let estadoCai: IestadosObjetos = emptyEstado;
  const createCai = useCreateCai();

  const [notification, setNotification] = useState<NotificationStateInterface>({
    ...NotificacionData,
  });

  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);

  /* Paginacion */

  const totalPaginas: number = Math.ceil(
    caisEmitidos.length / ITEMS_POR_PAGINA,
  );
  const inicio: number = (paginaActual - 1) * ITEMS_POR_PAGINA;
  const fin: number = inicio + ITEMS_POR_PAGINA;
  const caisPaginados: Icai[] = caisEmitidos.slice(inicio, fin);

  const [form, setForm] = useState<FormNuevoCai>(formNuevoCaiEmpty);

  const irAPagina = (pagina: number) => {
    if (pagina >= 1 && pagina <= totalPaginas) setPaginaActual(pagina);
  };

  /* Mostrar formulario */

  const mostrarFormularioNuevoCai = () => {
    setMostrarFormulario(true);
    setTimeout(() => handleScroll("formularioNuevoCai"), 100);
  };

  const ocultarFormularioNuevoCai = () => {
    setMostrarFormulario(false);
    setForm(formNuevoCaiEmpty);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let rawValue = e.target.value.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();

    if (rawValue.length > 32) return;

    const formattedValue = rawValue.match(/.{1,6}/g)?.join("-") || "";

    setForm((prev) => ({ ...prev, codigo: formattedValue }));
  };

  const onChangeField =
    (field: keyof FormNuevoCai) =>
    (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const value = event.target.value;
      setForm((prev) => ({
        ...prev,
        [field]:
          field === "fechaInicio" || field === "fechaFin"
            ? new Date(value + "T00:00:00")
            : value,
      }));
    };

  const onSubmitForm = async (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (Number(form.inicioRango) <= 0 || Number(form.finalRango) <= 0) {
      setNotification({ ...notificacionRangoCero });
      return;
    }

    if (Number(form.inicioRango) > Number(form.finalRango)) {
      setNotification({ ...notificacionRangoMayor });
      return;
    }

    try {
      const processed = await createCai.mutateAsync({
        ...form,
      });

      if (processed) {
        setNotification({ ...notificacionRegistroCaiExitoso });
        setForm(formNuevoCaiEmpty);
        setMostrarFormulario(false);
        return;
      }

      setNotification({ ...notificacionRegistroCaiError });
    } catch {
      setNotification({ ...notificacionRegistroCaiError });
    }
  };

  /* Contenido de la tabla */

  const { porcentajeEmitido, diasRestantes, facturasRestantes } =
    useMemo(() => {
      const finalRango = Number(caiVigente.rangoEmision?.final_rango || 0);
      const facturasEmitidas = Number(caiVigente.cantidadFacturasEmitidas || 0);
      const inicioRango = Number(caiVigente.rangoEmision?.inicio_rango || 0);

      const porcentaje =
        finalRango > 0 ? facturasEmitidas / (finalRango - inicioRango + 1) : 0;
      const restantes = Math.max(
        0,
        finalRango - (facturasEmitidas + inicioRango - 1),
      );

      const diffTime = fechaFin.getTime() - hoy.getTime();
      const dias = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      return {
        porcentajeEmitido: porcentaje.toFixed(3),
        diasRestantes: dias,
        facturasRestantes: restantes,
      };
    }, [caiVigente, fechaFin, hoy, fechaInicio]);

  /* Validar mensaje actual */

  if (hoy > fechaFin || isNaN(fechaFin.getTime())) {
    estadoCai = estadoCaiVencido;
  } else if (
    Number(porcentajeEmitido) * 100 < 80 &&
    Number(porcentajeEmitido) * 100 >= 0
  ) {
    estadoCai = estadoCaiValido;
  } else if (
    Number(porcentajeEmitido) * 100 >= 80 &&
    Number(porcentajeEmitido) * 100 < 100
  ) {
    estadoCai = estadoCaiProxVencer;
  } else if (Number(porcentajeEmitido) * 100 >= 100) {
    estadoCai = estadoCaiRangoAgotado;
  }

  const handleScroll = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start", // o 'center' si prefieres
      });
    }
  };

  /* Conseguir informacion del formulario */

  return (
    <main className="px-6 py-8 min-h-screen">
      <div className="flex justify-between items-centers">
        <HeaderTitleAdmin {...titleConfiguracionCAI} />
        {(isNaN(fechaFin.getTime()) ||
          Number(porcentajeEmitido) * 100 >= 100) && (
          <ButtonsComponet
            {...botonGenerarNuevoCAI}
            onClick={mostrarFormularioNuevoCai}
          />
        )}
      </div>

      <StatusNotification
        isVisible={notification.isVisible}
        variant={notification.variant}
        title={notification.title}
        message={notification.message}
        onClose={() =>
          setNotification((prev) => ({
            ...prev,
            isVisible: false,
          }))
        }
      />

      {/* Título */}

      {isLoadingCaiVigente ? (
        <div className="flex justify-center items-center mb-5 p-10">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#1498b2]"></div>
          <h1 className="mt-1 text-lg font-bold text-[#0b4d77] md:text-xl ml-7">
            Cargando cai Vigente
          </h1>
        </div>
      ) : (
        <div className="p-6 mb-8 mt-6 border-[#f3f5f8] hover:border-t-[#1498b2] border-6 rounded-2xl bg-[#f3f5f8] shadow-[0_6px_18px_rgba(0,0,0,0.1)]">
          {" "}
          {/* Comienzo de cai Vigente */}
          <div className="flex justify-between items-center mb-4">
            {" "}
            {/* Final de la primera fila */}
            <h2 className="mt-1 text-lg font-bold text-[#0b4d77] md:text-xl">
              CAI Vigente Activo
            </h2>
            {/* Mensaje de estado */}
            <EstadosObjetos {...estadoCai} />
            {/* Mensaje final de estado de cai */}
          </div>
          {/* Primera fila */}
          <div className="grid grid-cols-4 gap-4 mb-4">
            {" "}
            {/* Informacion general del CAI */}
            <div>
              <h3 className="text-[#4661b0] md:text-xl mb-2">Número de CAI</h3>
              <div className="bg-[#F4F6F8] rounded px-2 py-1 text-lg font-mono text-[#0b4d77] mt-1">
                {caiVigente.codigo}
              </div>
            </div>
            <div>
              <h3 className="text-[#4661b0] md:text-xl mb-2">
                Rango Autorizado
              </h3>
              <div className="text-lg font-semibold text-[#0b4d77] mt-1">
                {`${Number(caiVigente.rangoEmision?.inicio_rango || 0).toLocaleString("en-US")} - ${Number(caiVigente.rangoEmision?.final_rango || 0).toLocaleString("en-US")}`}
              </div>
            </div>
            <div>
              <h3 className="text-[#4661b0] md:text-xl mb-2">
                Fecha de Vencimiento
              </h3>
              <div className="text-s font-semibold text-[#0b4d77] mt-1">
                {fechaFin.getDay()}/{fechaFin.getMonth()}/
                {fechaFin.getFullYear()}
              </div>
              <div className="text-s text-[#9A9A9A]">
                {diasRestantes} días restantes
              </div>
            </div>
            <div>
              <h3 className="text-[#4661b0] md:text-xl mb-2">
                Última Factura Emitida
              </h3>
              <div className="text-s font-semibold text-[#0b4d77] mt-1">
                N° de factura:{" "}
                {Number(caiVigente.cantidadFacturasEmitidas) +
                  Number(caiVigente.rangoEmision?.inicio_rango) -
                  1}
              </div>
            </div>
          </div>
          {/* Final informacion general del cai */}
          {/* Barra de uso de rango */}
          <div className="mb-2">
            <div className="flex justify-between text-xs text-[#4A4E69] mb-1">
              <span className="text-lg text-[#4661b0] font-semibold">
                Inicial: {caiVigente.rangoEmision?.inicio_rango || "0"}
              </span>
              <span className="text-lg text-[#4661b0] font-semibold">
                Final: {caiVigente.rangoEmision?.final_rango || "0"}
              </span>
            </div>
            <div className="relative h-3  border-[#747c7e] bg-[#bfc5c7] rounded">
              <div
                className="absolute left-0 top-0 h-3 rounded"
                style={{
                  width: `${Number(porcentajeEmitido) * 100}% `,
                  backgroundColor: `${Number(porcentajeEmitido) * 100 >= 80 && Number(porcentajeEmitido) * 100 < 100 ? "#FF9900" : Number(porcentajeEmitido) * 100 >= 100 ? "#ec1919" : "#168e48"}`,
                }}
              ></div>
            </div>
            <div className="flex justify-end text-lg text-[#4661b0] font-semibold mt-4">
              {facturasRestantes} facturas disponibles
            </div>
          </div>
          {/* Final de barra de uso de rango */}
          {/* Alerta */}
          {Number(porcentajeEmitido) * 100 >= 80 &&
            Number(porcentajeEmitido) * 100 < 100 && (
              <AlertaComponent {...alertaCaiPorAgotar} />
            )}
          {Number(porcentajeEmitido) * 100 >= 100 && (
            <AlertaComponent {...alertaCaiRangoAgotado} />
          )}
          {isNaN(fechaFin.getTime()) && (
            <AlertaComponent {...alertaCaiVencido} />
          )}
          {/* Final de alerta */}
        </div>
      )}

      {/* Registrar Nuevo CAI */}
      {mostrarFormulario && (
        <FormNuevoCAI
          ocultarFormularioNuevoCai={ocultarFormularioNuevoCai}
          form={form}
          onChangeField={onChangeField}
          onSubmitForm={onSubmitForm}
          handleChange={handleChange}
        />
      )}

      {/* Tabla */}
      <div>
        <h3 className="text-lg font-bold text-[#0b4d77] md:text-xl bg-[#f3f5f8] p-6  mt-3 border-[#f3f5f8] hover:border-t-[#1498b2] border-6 rounded-t-2xl shadow-[0_6px_18px_rgba(0,0,0,0.1)]">
          CAI Emitidos
        </h3>
        <TableComponent
          tituloTablaInventario={tituloTablaCaisEmitidos}
          contenidoTabla={contenidoTablaCaiEmitidos(
            isLoadingCaisEmitidos,
            caisPaginados,
          )}
          /* Paginacion */
        />
      </div>

      <PaginacionComponent
        inicio={inicio}
        fin={fin}
        registros={caisEmitidos}
        paginaActual={paginaActual}
        totalPaginas={totalPaginas}
        action={irAPagina}
      />
    </main>
  );
}
