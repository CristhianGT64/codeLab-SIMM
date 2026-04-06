import type { Icai } from "../interfaces/CAI/Icai";

export const normalizeDateToStartOfDay = (date: Date) => {
  const normalizedDate = new Date(date);
  normalizedDate.setHours(0, 0, 0, 0);
  return normalizedDate;
};

export const isCaiExpired = (fechaFin?: string | null, referenceDate = new Date()) => {
  if (!fechaFin) {
    return true;
  }

  const expirationDate = normalizeDateToStartOfDay(new Date(fechaFin));

  if (Number.isNaN(expirationDate.getTime())) {
    return true;
  }

  return normalizeDateToStartOfDay(referenceDate) > expirationDate;
};

export const getCaiRangeSize = (cai?: Icai | null) => {
  const start = Number(cai?.rangoEmision?.inicio_rango ?? 0);
  const end = Number(cai?.rangoEmision?.final_rango ?? 0);

  if (!Number.isFinite(start) || !Number.isFinite(end) || start <= 0 || end < start) {
    return 0;
  }

  return end - start + 1;
};

export const isCaiRangeExhausted = (cai?: Icai | null) => {
  if (!cai) {
    return false;
  }

  const rangeSize = getCaiRangeSize(cai);

  if (rangeSize <= 0) {
    return false;
  }

  return Number(cai.cantidadFacturasEmitidas ?? 0) >= rangeSize;
};

export const getCaiPosBlockInfo = (cai?: Icai | null) => {
  if (!cai) {
    return {
      title: "POS bloqueado por CAI no disponible",
      message: "No hay un CAI vigente configurado. Debes registrar o renovar el CAI antes de usar el POS.",
    };
  }

  if (isCaiExpired(cai.fechaFin)) {
    const expirationDate = new Date(cai.fechaFin);
    const formattedDate = Number.isNaN(expirationDate.getTime())
      ? ""
      : expirationDate.toLocaleDateString("es-HN", {
          day: "2-digit",
          month: "long",
          year: "numeric",
        });

    return {
      title: "POS bloqueado por CAI vencido",
      message: formattedDate
        ? `El CAI venció el ${formattedDate}. Debes renovarlo para volver a usar el POS.`
        : "El CAI está vencido. Debes renovarlo para volver a usar el POS.",
    };
  }

  if (isCaiRangeExhausted(cai)) {
    return {
      title: "POS bloqueado por rango CAI agotado",
      message: "El CAI vigente ya agotó su rango de facturación. Debes renovarlo para volver a usar el POS.",
    };
  }

  if (cai.disponible === false) {
    return {
      title: "POS bloqueado por CAI no disponible",
      message: "El CAI vigente no está disponible para facturar. Debes revisarlo o renovarlo antes de usar el POS.",
    };
  }

  return null;
};
