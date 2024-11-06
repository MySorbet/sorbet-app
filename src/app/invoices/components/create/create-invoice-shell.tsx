// TODO: Can we choose the animation direction based on a forward or backward nav? Mutli-page form makes this harder. Maybe use query state?
/**
 * A shell component to wrap each page of the invoice creation form
 *
 * Lays out children in a centered column with a quick easy slide-in animation
 */
export const CreateInvoiceShell = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <div className='flex size-full justify-center'>
      {/* Cheap animation to make the form have a smooth transition */}
      <div className='animate-in slide-in-from-right-3 fade-in-50 flex w-full min-w-96 max-w-[50rem] flex-col items-center gap-4'>
        {children}
      </div>
    </div>
  );
};
