export const CreateInvoiceFooter = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <div className='mt-4 flex justify-between border-t border-gray-200 py-4'>
      {children}
    </div>
  );
};
