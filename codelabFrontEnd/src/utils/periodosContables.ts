import type {
  PeriodoContable,
  TipoPeriodoContable,
} from "../interfaces/PeriodosContables/PeriodoContableInterface";

type PeriodoContableBase = Pick<PeriodoContable, "fechaInicio" | "fechaFin">;
type PeriodoContableActiveBase = PeriodoContableBase & {
  estado?: string | null;
};

const normalizeText = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase();

const getDateOnly = (value: string) => value.slice(0, 10);

const parseDate = (value: string) => {
  const parsed = new Date(`${getDateOnly(value)}T00:00:00`);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

const getLastDayOfMonth = (year: number, monthIndex: number) =>
  new Date(year, monthIndex + 1, 0).getDate();

export const getPeriodoContableTipo = ({
  fechaInicio,
  fechaFin,
}: PeriodoContableBase): TipoPeriodoContable => {
  const inicio = parseDate(fechaInicio);
  const fin = parseDate(fechaFin);

  if (!inicio || !fin) {
    return "PERSONALIZADO";
  }

  const mismoMes =
    inicio.getFullYear() === fin.getFullYear()
    && inicio.getMonth() === fin.getMonth();
  const esMensual =
    mismoMes
    && inicio.getDate() === 1
    && fin.getDate() === getLastDayOfMonth(fin.getFullYear(), fin.getMonth());

  if (esMensual) {
    return "MENSUAL";
  }

  const esAnual =
    inicio.getMonth() === 0
    && inicio.getDate() === 1
    && fin.getMonth() === 11
    && fin.getDate() === 31
    && inicio.getFullYear() === fin.getFullYear();

  return esAnual ? "ANUAL" : "PERSONALIZADO";
};

export const getPeriodoContableClave = ({
  fechaInicio,
  fechaFin,
}: PeriodoContableBase) => {
  if (getPeriodoContableTipo({ fechaInicio, fechaFin }) !== "MENSUAL") {
    return "";
  }

  return getDateOnly(fechaInicio).slice(0, 7);
};

export const formatPeriodoContableLabel = (periodo: string) => {
  if (!/^\d{4}-\d{2}$/.test(periodo)) {
    return periodo;
  }

  const parsed = new Date(`${periodo}-01T00:00:00`);

  if (Number.isNaN(parsed.getTime())) {
    return periodo;
  }

  return new Intl.DateTimeFormat("es-HN", {
    month: "long",
    year: "numeric",
  }).format(parsed);
};

export const formatPeriodoDate = (value: string | null) => {
  if (!value) {
    return "Sin fecha";
  }

  const parsed = new Date(value);

  if (Number.isNaN(parsed.getTime())) {
    return "Sin fecha";
  }

  return new Intl.DateTimeFormat("es-HN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(parsed);
};

export const formatPeriodoRango = ({
  fechaInicio,
  fechaFin,
}: PeriodoContableBase) => `${formatPeriodoDate(fechaInicio)} - ${formatPeriodoDate(fechaFin)}`;

export const getTipoPeriodoLabel = (tipo: TipoPeriodoContable) => {
  switch (tipo) {
    case "MENSUAL":
      return "Mensual";
    case "ANUAL":
      return "Anual";
    default:
      return "Personalizado";
  }
};

export const isPeriodoContableActivo = ({
  fechaInicio,
  fechaFin,
  estado,
}: PeriodoContableActiveBase) => {
  const estadoNormalizado = normalizeText(String(estado ?? "ABIERTO"));

  if (estadoNormalizado.includes("cerr")) {
    return false;
  }

  const inicio = parseDate(fechaInicio);
  const fin = parseDate(fechaFin);

  if (!inicio || !fin) {
    return false;
  }

  const today = new Date();
  const current = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
  );

  return current >= inicio && current <= fin;
};

export const getRangeFromPeriodoClave = (periodoClave: string) => {
  if (!/^\d{4}-\d{2}$/.test(periodoClave)) {
    return null;
  }

  const [yearValue, monthValue] = periodoClave.split("-");
  const year = Number(yearValue);
  const monthIndex = Number(monthValue) - 1;

  if (!Number.isInteger(year) || !Number.isInteger(monthIndex) || monthIndex < 0 || monthIndex > 11) {
    return null;
  }

  const lastDay = `${getLastDayOfMonth(year, monthIndex)}`.padStart(2, "0");

  return {
    fechaInicio: `${periodoClave}-01`,
    fechaFin: `${periodoClave}-${lastDay}`,
  };
};

export const canClosePeriodoContableByRole = (roleName?: string | null) => {
  const normalized = normalizeText(roleName ?? "");
  return normalized === "administrador" || normalized === "contador";
};

export const isPeriodoContableClosedError = (message: string) => {
  const normalized = normalizeText(message);
  return normalized.includes("periodo") && normalized.includes("cerr");
};
