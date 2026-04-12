const numberFmt = new Intl.NumberFormat("en-GB", {
  maximumFractionDigits: 1,
});

export function litresFmt(value: number | null) {
  return value == null ? "-" : `${numberFmt.format(value)} L`;
}

export function economyFmt(value: number | null) {
  return value == null ? "-" : `${numberFmt.format(value)} mpg`;
}

export function pricePerLitreFmt(value: number | null) {
  return value == null || value === 0 ? "-" : `£${value.toFixed(3)}`;
}

export function signedPercentFmt(value: number | null) {
  if (value == null || !Number.isFinite(value)) return "-";
  const sign = value > 0 ? "+" : "";
  return `${sign}${value.toFixed(1)}%`;
}
