export function buildCaiError(message, status = 400) {
  const err = new Error(message);
  err.status = status;
  return err;
}
