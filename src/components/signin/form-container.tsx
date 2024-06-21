'use client';

import { FC, PropsWithChildren } from 'react';

const FormContainer: FC<PropsWithChildren<{}>> = ({ children }) => {
  return (
    <div
      style={{
        boxShadow: '0px 20px 60px 0px #20202026',
      }}
      className='bg-[#F9F7FF] w-[400px] p-6 rounded-3xl flex flex-col gap-6'
    >
      {children}
    </div>
  );
};

export { FormContainer };
