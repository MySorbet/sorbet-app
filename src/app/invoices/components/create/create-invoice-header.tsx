/**
 * A header component for the invoice creation form
 *
 * Renders children in a justify-between row with the appropriate separator on bottom
 */
export const CreateInvoiceHeader = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <div className='mb-4 flex w-full items-center justify-between border-b border-gray-200 py-4'>
      {children}
    </div>
  );
};
