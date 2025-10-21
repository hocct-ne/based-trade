export function formatQty(value: number, maxDecimals: number = 5): any {
  if (isNaN(value)) return 0;
  const [int, dec] = value.toString().split(".");
  if (!dec) return int;
  if (dec.length <= maxDecimals) return value;
  return parseFloat(value.toFixed(maxDecimals));
}
