/**
 * Use this to format currency anywhere within invoices
 * - Accepts strings for backwards compatibility, but just convert them to numbers before formatting
 */
export const formatCurrency = (amount?: number | string) => {
  if (amount === undefined) return '';

  if (typeof amount === 'string') {
    amount = Number(amount);
  }
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};
