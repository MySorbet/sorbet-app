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

/**
 * Use this to create a title for the create invoice header.
 *
 * @example
 * <CreateInvoiceHeader>
 *    <CreateInvoiceTitle>Invoice Details</CreateInvoiceTitle>
 * </CreateInvoiceHeader>
 */
export const CreateInvoiceTitle = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return <h2 className='text-2xl font-bold'>{children}</h2>;
};
