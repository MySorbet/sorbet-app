export const Processing = () => {
  return (
    <div className='flex flex-col items-center justify-center gap-6'>
      <div className='bg-muted size-28 animate-pulse rounded-full'></div>
      <span className='text-sm font-medium leading-none'>
        Processing transaction...
      </span>
    </div>
  );
};
