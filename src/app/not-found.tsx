import { Metadata } from 'next';
import * as React from 'react';
import { RiAlarmWarningFill } from 'react-icons/ri';

export const metadata: Metadata = {
  title: 'Not Found',
};

export default function NotFound() {
  return (
    <main>
      <section className='bg-white'>
        <div className='flex flex-col gap-4 items-center justify-center h-screen'>
          <RiAlarmWarningFill size='50' className='text-red-500 mb-4' />
          <div className='text-center'>
            <h1 className='text-4xl font-bold mb-4'>Page does not exist.</h1>
            <a href='/' className='text-blue-600 hover:underline'>
              Back to home
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
