/**
 * Use this to create a title within a `<CreateInvoiceHeader/>`.
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
