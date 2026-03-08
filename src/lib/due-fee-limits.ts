export const parsePositiveDueLimit = (
  value: string | null | undefined
): number | null => {
  const parsed = value == null ? Number.NaN : Number.parseFloat(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
};
