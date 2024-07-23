'use client';

const TypingIndicator = () => {
  return (
    <div className='flex gap-1 items-center justify-center h-6 w-16'>
      <div className='h-3 w-3 rounded-full bg-gray-600 animate-bounce delay-0' />
      <div className='h-3 w-3 rounded-full bg-gray-600 animate-bounce delay-75' />
      <div className='h-3 w-3 rounded-full bg-gray-600 animate-bounce delay-150' />
    </div>
  );
};

export { TypingIndicator };
