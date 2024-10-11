export const CreateInvoiceShell = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <div className='flex size-full justify-center'>
      {/* Cheap animation to make the form have a smooth transition */}
      <div className='animate-in slide-in-from-right-3 fade-in-50 flex min-w-96 max-w-screen-md flex-col gap-4'>
        {children}
      </div>
    </div>
  );
};

// This little constructor is used to determine the direction of the animation
// TODO: Just have to figure out where to insert this so that it has access to the current and next pages, and can inform the animation
const pages = ['client', 'items', 'payment'] as const;
type Page = (typeof pages)[number];
const direction = (current: Page, next: Page): 'left' | 'right' => {
  const currentIndex = pages.indexOf(current);
  const nextIndex = pages.indexOf(next);
  return currentIndex < nextIndex ? 'right' : 'left';
};
