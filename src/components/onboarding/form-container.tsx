'use client';

import { FC, PropsWithChildren } from 'react';

const FormContainer: FC<PropsWithChildren> = ({ children }) => {
  return (
    <div
      style={{
        boxShadow: '0px 20px 60px 0px #20202026',
      }}
      className='flex w-[400px] flex-col gap-6 rounded-3xl bg-[#F9F7FF] p-6'
    >
      {children}
    </div>
  );
};

export { FormContainer };
