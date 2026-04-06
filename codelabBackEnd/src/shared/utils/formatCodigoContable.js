export function formatCodigoContable(codigo) {

  const code = String(codigo).padStart(4,'0');

  const e = code.substring(0,1);
  const c = code.substring(1,2);
  const cu = code.substring(2,3);
  const sc = code.substring(3,4).padStart(3,'0');

  return `${e}.${c}.${cu}.${sc}`;

}