'use client';

const TypingIndicator = () => {
  return (
    <div className='flex h-6 w-16 items-center justify-center gap-1'>
      <div className='h-3 w-3 animate-bounce rounded-full bg-gray-600 delay-0' />
      <div className='h-3 w-3 animate-bounce rounded-full bg-gray-600 delay-75' />
      <div className='h-3 w-3 animate-bounce rounded-full bg-gray-600 delay-150' />
    </div>
  );
};

export { TypingIndicator };
