import { forwardRef, ReactNode } from 'react';

import { cn } from '@/lib/utils';

/**
 * Render a main element with a flex column layout
 * Usually, you will render an app header, a page header, and a page content
 * inside the main element
 */
const Main = forwardRef<
  HTMLDivElement,
  { children: ReactNode; className?: string }
>(({ children, className }, ref) => {
  return (
    <main ref={ref} className={cn('flex w-full flex-col', className)}>
      {children}
    </main>
  );
});

Main.displayName = 'Main';

/**
 * Render a container element with a flex column layout
 * Usually, you will render a page content inside the page main element
 */
const Content = forwardRef<
  HTMLDivElement,
  { children: ReactNode; className?: string }
>(({ children, className }, ref) => {
  return (
    <div
      ref={ref}
      className={cn('container flex flex-1 justify-center pt-0 px-6 pb-6', className)}
    >
      {children}
    </div>
  );
});

Content.displayName = 'Content';

// Create a Page object with Main and Content as properties
const Page = {
  Main,
  Content,
};

export default Page;
