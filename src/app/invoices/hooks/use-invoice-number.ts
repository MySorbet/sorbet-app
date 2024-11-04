/**
 * Gets the auto-incremented invoice number for the current user
 */
export const useInvoiceNumber = () => {
  // TODO: Store the last invoice number, and auto-increment from there
  // This could be acheived by storing the invoice number in the database
  // Or by querying the number of invoices for the current user and incrementing from there
  return 'INV-001';
};
