/**
 * Use this to format currency anywhere within invoices.
 * - Accepts strings for backwards compatibility
 * - Defaults to USD when no currency code is provided
 */
export const formatCurrency = (
  amount?: number | string,
  currency = 'USD'
) => {
  if (amount === undefined) return '';

  if (typeof amount === 'string') {
    amount = Number(amount);
  }
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount);
};
