/**
 * Use this to format currency anywhere within invoices
 */
export const formatCurrency = (amount?: number) => {
  if (amount === undefined) return '';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};
