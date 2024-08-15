import { ReactNode } from 'react';

export const Body = ({ children }: { children: ReactNode }) => {
  return (
    <div className='flex h-full w-full flex-col gap-10 px-2 py-4'>
      {children}
    </div>
  );
};
