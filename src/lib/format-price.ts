export function formatPrice(value: number | null | { toString(): string }): string {
  const amount = typeof value === "number" || value === null ? (value ?? 0) : Number(value);

  return `$${new Intl.NumberFormat("es-AR", {
    maximumFractionDigits: 0,
  }).format(amount)}`;
}
