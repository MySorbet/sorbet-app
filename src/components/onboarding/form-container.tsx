import { FC, PropsWithChildren } from 'react';

const FormContainer: FC<PropsWithChildren> = ({ children }) => {
  return (
    <div className='flex w-[400px] flex-col gap-6 rounded-3xl bg-[#F9F7FF] p-6 shadow-lg'>
      <div className='animate-in slide-in-from-right-3 fade-in-50 size-full'>
        {children}
      </div>
    </div>
  );
};

export { FormContainer };
