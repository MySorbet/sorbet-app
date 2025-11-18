import { forwardRef } from 'react';

import { formatCurrency } from '@/lib/currency';
import { cn } from '@/lib/utils';
import { useBridgeCustomer } from '@/hooks/profile/use-bridge-customer';

import { AcceptedPaymentMethod, Invoice, InvoiceForm } from '../schema';
import { calculateSubtotalTaxAndTotal, formatDate } from '../utils';

/**
 * Get the platform fee percentage from Bridge customer data
 * Checks both USD and EUR virtual accounts, prioritizing USD if both exist
 */
const usePlatformFeePercent = (paymentMethods?: AcceptedPaymentMethod[]) => {
  const { data: bridgeCustomer } = useBridgeCustomer();
  
  if (!paymentMethods || !bridgeCustomer) {
    return undefined;
  }
  
  const hasUsd = paymentMethods.includes('usd');
  const hasEur = paymentMethods.includes('eur');
  
  // If USD is selected, use USD virtual account fee
  if (hasUsd && bridgeCustomer.virtual_account?.developer_fee_percent) {
    return parseFloat(bridgeCustomer.virtual_account.developer_fee_percent);
  }
  
  // If EUR is selected, use EUR virtual account fee
  if (hasEur && bridgeCustomer.virtual_account_eur?.developer_fee_percent) {
    return parseFloat(bridgeCustomer.virtual_account_eur.developer_fee_percent);
  }
  
  return undefined;
};

/**
 * Render a PDF-like document displaying the invoice details.
 *
 * Can accept either an
 *
 * - `InvoiceForm` object (in the case you use it to live render the invoice form). In this
 * case, the `totalAmount` will be calculated on the frontend by totalling the items.
 *
 * - Or an `Invoice` object (in the case you use it to display a finalized invoice). In this
 * case, the `totalAmount` from the object will be used.
 */
export const InvoiceDocument = forwardRef<
  HTMLDivElement,
  { invoice: InvoiceForm | Invoice; className?: string }
>(({ invoice, className }, ref) => {
  const platformFeePercent = usePlatformFeePercent(invoice.paymentMethods);
  const { taxAmount, developerFee, total, developerFeePercent: calculatedFeePercent } = 
    calculateSubtotalTaxAndTotal(invoice, platformFeePercent);
  
  // Use the calculated fee percent for display
  const displayFeePercent = calculatedFeePercent ?? 1;
  
  // Total amount is dependent on which type of invoice we get
  // If this is full invoice from the server, the amount has been calculated already
  // If this is form data, we'll need to calculate it ourselves
  const totalAmount = 'totalAmount' in invoice ? invoice.totalAmount : total;

  // Backwards compatibility
  const projectName =
    'projectName' in invoice ? invoice.projectName : undefined;
  const includesBankFee = invoice.paymentMethods?.some((method) =>
    ['usd', 'eur'].includes(method)
  );

  return (
    <div
      className={cn(
        'mx-auto w-[21cm] rounded-2xl bg-white p-16',
        // 'min-h-[29.7cm]', // Note: Use this if you want A4 height
        className
      )}
      ref={ref}
    >
      <h1 className='text-5xl font-semibold'>Invoice</h1>
      <p className='pt-1 text-xs'>{invoice.invoiceNumber}</p>
      {projectName && <p className='pt-1 text-xs'>{projectName}</p>}

      <table className='mb-20 mt-16 w-full'>
        <thead>
          <tr className='border-muted border-b'>
            <th className='pb-3 text-left'>
              <h2 className='text-muted-foreground text-xs font-semibold'>
                From
              </h2>
            </th>
            <th className='pb-3 text-left'>
              <h2 className='text-muted-foreground text-xs font-semibold'>
                To
              </h2>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className='pt-2'>
              <p className='pt-1 text-xs'>{invoice.fromName}</p>
              <p className='pt-1 text-xs'>{invoice.fromEmail}</p>
              {invoice.taxId && (
                <p className='pt-1 text-xs'>Tax ID: {invoice.taxId}</p>
              )}
              {invoice.address && (
                <div className='pt-1 text-xs'>
                  <p>{invoice.address.street}</p>
                  <p>
                    {invoice.address.city}, {invoice.address.state}{' '}
                    {invoice.address.zip}
                  </p>
                  <p>{invoice.address.country}</p>
                </div>
              )}
            </td>
            <td className='pt-2'>
              <p className='pt-1 text-xs'>{invoice.toName}</p>
              <p className='pt-1 text-xs'>{invoice.toEmail}</p>
            </td>
          </tr>
        </tbody>
      </table>

      <table className='mb-12 w-full'>
        <thead>
          <tr className='border-muted border-b'>
            <th className='text-muted-foreground pb-2 text-left text-xs font-semibold'>
              Item
            </th>
            <th className='text-muted-foreground pb-2 text-right text-xs font-semibold'>
              Quantity
            </th>
            <th className='text-muted-foreground pb-2 text-right text-xs font-semibold'>
              Amount
            </th>
          </tr>
        </thead>
        <tbody>
          {invoice.items?.map((item, index) => (
            <tr key={index}>
              <td className='py-3 text-xs'>{item.name}</td>
              <td className='py-3 text-right text-xs'>{item.quantity}</td>
              <td className='py-3 text-right text-xs'>
                {formatCurrency(item.amount)}
              </td>
            </tr>
          ))}
          {taxAmount > 0 && (
            <tr>
              <td className='py-3 text-xs'>{/** Empty cell */}</td>
              <td className='py-3 text-right text-xs'>Sales Tax</td>
              <td className='py-3 text-right text-xs'>
                {formatCurrency(taxAmount)}
              </td>
            </tr>
          )}
          {developerFee > 0 && (
            <tr>
              <td className='py-3 text-xs'>{/** Empty cell */}</td>
              <td className='py-3 text-right text-xs'>
                Platform Fee ({displayFeePercent}%)
              </td>
              <td className='py-3 text-right text-xs'>
                {formatCurrency(developerFee)}
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <div className='mb-20 flex items-baseline justify-between'>
        <span className='mr-4 text-sm font-semibold'>Total</span>
        <span className='text-lg font-semibold'>
          {formatCurrency(totalAmount)}
        </span>
      </div>

      <table className='w-full'>
        <thead>
          <tr className='border-muted border-b'>
            <th className='text-muted-foreground pb-2 text-left text-xs font-semibold'>
              Terms
            </th>
            <th className='text-muted-foreground pb-2 text-left text-xs font-semibold'>
              Memo
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className='space-y-3 pr-4 pt-2'>
              <div className='flex'>
                <p className='min-w-16 text-xs'>Issued</p>
                <p className='text-xs font-semibold'>
                  {formatDate(invoice.issueDate)}
                </p>
              </div>
              <div className='flex'>
                <p className='min-w-16 text-xs'>Due</p>
                <p className='text-xs font-semibold'>
                  {formatDate(invoice.dueDate)}
                </p>
              </div>
              <div className='flex'>
                <p className='min-w-16 text-xs'>Pay by</p>
                <p className='text-xs font-semibold'>
                  {invoice.paymentMethods
                    .map((method) => paymentMethodDisplay[method])
                    .join(', ')}
                </p>
              </div>
            </td>
            <td className='max-w-sm pt-2'>
              <p className='text-xs'>{invoice.memo}</p>
            </td>
          </tr>
        </tbody>
      </table>

      {includesBankFee && displayFeePercent > 0 && (
        <div className='mt-8 rounded-lg bg-muted p-4 text-xs text-muted-foreground'>
          For EUR and USD payments, Sorbet applies a {displayFeePercent}% platform fee to cover
          banking and compliance costs.
        </div>
      )}
    </div>
  );
});

/** Map all payment methods to their display name for the invoice document */
const paymentMethodDisplay: Record<AcceptedPaymentMethod, string> = {
  usdc: 'USDC',
  usd: 'ACH / Wire',
  eur: 'SEPA',
};
