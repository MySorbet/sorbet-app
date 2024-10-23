import { forwardRef } from 'react';

import { InvoiceFormData } from './create/invoice-form-context';
import {
  calculateTotalAmount,
  formatCurrency,
  formatDate,
} from './dashboard/utils';

export const InvoiceDocument = forwardRef<
  HTMLDivElement,
  { invoice: InvoiceFormData }
>(({ invoice }, ref) => {
  return (
    <div
      className='mx-auto min-w-[800px] max-w-4xl rounded-2xl bg-white p-16'
      ref={ref}
    >
      <h1 className='mb-16 text-5xl font-semibold'>Invoice</h1>

      <table className='mb-20 w-full'>
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
            <th className='pb-3 text-left'>
              <h2 className='text-muted-foreground text-xs font-semibold'>
                Details
              </h2>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className='pt-2'>
              <p className='pt-1 text-xs'>{invoice.fromName}</p>
              <p className='pt-1 text-xs'>{invoice.fromEmail}</p>
            </td>
            <td className='pt-2'>
              <p className='pt-1 text-xs'>{invoice.toName}</p>
              <p className='pt-1 text-xs'>{invoice.toEmail}</p>
            </td>
            <td className='pt-2'>
              <p className='pt-1 text-xs'>{invoice.projectName}</p>
              <p className='pt-1 text-xs'>{invoice.invoiceNumber}</p>
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
        </tbody>
      </table>

      <div className='mb-20 flex items-baseline justify-between'>
        <span className='mr-4 text-sm font-semibold'>Total</span>
        <span className='text-lg font-semibold'>
          {formatCurrency(calculateTotalAmount(invoice.items ?? []))}
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
                  USDC, ACH / Wire, Credit Card
                </p>
              </div>
            </td>
            <td className='pt-2'>
              <p className='text-xs'>{invoice.memo}</p>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
});
