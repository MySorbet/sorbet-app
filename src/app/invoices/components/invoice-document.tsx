import { forwardRef } from 'react';

import { useDueFeeStructures } from '@/hooks/profile/use-due-fee-structures';
import { useFxRate } from '@/hooks/use-fx-rate';
import { formatCurrency } from '@/lib/currency';
import { cn } from '@/lib/utils';

import { AcceptedPaymentMethod, Invoice, InvoiceForm } from '../schema';
import { calculateSubtotalTaxAndTotal, formatDate } from '../utils';

type VirtualRail = 'usd_ach' | 'usd_wire' | 'usd_swift' | 'eur_sepa' | 'eur_swift' | 'aed_local';

/** Default rail to use for fee lookup when no specific rail has been stored. */
const DEFAULT_RAIL: Record<string, VirtualRail> = {
  usd: 'usd_ach',
  eur: 'eur_sepa',
  aed: 'aed_local',
};

/**
 * Resolves the `{ feeBps, fixedFee }` fee structure for the invoice's virtual payment rail.
 * Filters to `channelType === 'static_deposit'`, preferring `accountType = 'any'` then
 * falling back to `'individual'` and finally any available static_deposit row.
 * Uses `virtualPaymentRail` if provided; otherwise falls back to the default rail for the currency.
 */
const useTransactionFeeStructure = (
  paymentMethods?: AcceptedPaymentMethod[],
  virtualPaymentRail?: string
): { feeBps: number; fixedFee: number } | undefined => {
  const { data: dueFeeStructures } = useDueFeeStructures();

  if (!paymentMethods || !dueFeeStructures) return undefined;

  // Determine which rail to look up
  let rail: VirtualRail | undefined = virtualPaymentRail as VirtualRail | undefined;
  if (!rail) {
    const bankMethod = paymentMethods.find((m) => m in DEFAULT_RAIL) as
      | keyof typeof DEFAULT_RAIL
      | undefined;
    if (!bankMethod) return undefined;
    rail = DEFAULT_RAIL[bankMethod];
  }

  const candidates = dueFeeStructures.filter(
    (r) => r.paymentMethod === rail && r.channelType === 'static_deposit'
  );

  // Prefer 'any' → 'individual' → first available
  const row =
    candidates.find((r) => r.accountType === 'any') ??
    candidates.find((r) => r.accountType === 'individual') ??
    candidates[0];

  if (!row) return undefined;

  return { feeBps: row.totalFeeBps, fixedFee: parseFloat(row.totalFixedFee) };
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
  // Only apply the Due fee structure for new invoices that carry a virtualPaymentRail.
  // Old invoices already have the legacy 1% platform fee baked into their stored
  // totalAmount, so we must not re-calculate or display a fee row for them.
  const isNewFeeFlow = !!invoice.virtualPaymentRail;
  const feeStructure = useTransactionFeeStructure(
    isNewFeeFlow ? invoice.paymentMethods : undefined,
    invoice.virtualPaymentRail
  );
  const { taxAmount, transactionFee, total } = calculateSubtotalTaxAndTotal(
    invoice,
    feeStructure
  );

  // Total amount is dependent on which type of invoice we get
  // If this is full invoice from the server, the amount has been calculated already
  // If this is form data, we'll need to calculate it ourselves
  const totalAmount = 'totalAmount' in invoice ? invoice.totalAmount : total;

  const currency = invoice.currency ?? 'USD';
  const showUsdEquivalent = currency !== 'USD';
  const { data: fxData } = useFxRate(currency, 'USD');
  const usdEquivalent =
    fxData && totalAmount != null
      ? Number(totalAmount) * fxData.rate
      : undefined;

  // Backwards compatibility
  const projectName =
    'projectName' in invoice ? invoice.projectName : undefined;

  return (
    <div
      className={cn(
        'mx-auto w-[21cm] rounded-2xl bg-white p-16',
        // 'min-h-[29.7cm]', // Note: Use this if you want A4 height
        className
      )}
      ref={ref}
    >
      <div className='flex items-start justify-between'>
        <div>
          <h1 className='text-5xl font-semibold'>Invoice</h1>
          <p className='pt-1 text-xs'>{invoice.invoiceNumber}</p>
          {projectName && <p className='pt-1 text-xs'>{projectName}</p>}
        </div>
        {invoice.logoUrl && (
          <img
            src={invoice.logoUrl}
            alt='Invoice logo'
            className='h-20 w-20 object-contain'
          />
        )}
      </div>

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
              {invoice.toBusinessName && (
                <p className='pt-1 text-xs'>{invoice.toBusinessName}</p>
              )}
              {invoice.toAddress && (
                <div className='pt-1 text-xs'>
                  <p>{invoice.toAddress.street}</p>
                  <p>
                    {invoice.toAddress.city}, {invoice.toAddress.state}{' '}
                    {invoice.toAddress.zip}
                  </p>
                  <p>{invoice.toAddress.country}</p>
                </div>
              )}
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
                {formatCurrency(item.amount, currency)}
              </td>
            </tr>
          ))}
          {taxAmount > 0 && (
            <tr>
              <td className='py-3 text-xs'>{/** Empty cell */}</td>
              <td className='py-3 text-right text-xs'>Sales Tax</td>
              <td className='py-3 text-right text-xs'>
                {formatCurrency(taxAmount, currency)}
              </td>
            </tr>
          )}
          {transactionFee > 0 && (
            <tr>
              <td className='py-3 text-xs'>{/** Empty cell */}</td>
              <td className='py-3 text-right text-xs'>Transaction fee</td>
              <td className='py-3 text-right text-xs'>
                {formatCurrency(transactionFee, currency)}
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <div className='mb-20 flex flex-col gap-1'>
        <div className='flex items-baseline justify-between'>
          <span className='mr-4 text-sm font-semibold'>Total</span>
          <span className='text-lg font-semibold'>
            {formatCurrency(totalAmount, currency)}
          </span>
        </div>
        {showUsdEquivalent && (
          <div className='flex items-baseline justify-between'>
            <span className='text-muted-foreground text-xs'>
              Calculated using the exchange rate at the time of creating invoice.
            </span>
            <span className='text-muted-foreground text-xs'>
              {usdEquivalent != null
                ? `≈ ${formatCurrency(usdEquivalent, 'USD')}`
                : '—'}
            </span>
          </div>
        )}
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

    </div>
  );
});

/** Map all payment methods to their display name for the invoice document */
const paymentMethodDisplay: Record<AcceptedPaymentMethod, string> = {
  usdc: 'USDC',
  usd: 'ACH / Wire / Swift',
  eur: 'SEPA',
  aed: 'Local Transfer (AED)',
};
