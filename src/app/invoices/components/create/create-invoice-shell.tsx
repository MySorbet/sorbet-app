export const CreateInvoiceShell = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <div className='flex size-full justify-center'>
      <div className='flex min-w-96 max-w-screen-md flex-col gap-4'>
        {children}
      </div>
    </div>
  );
};
