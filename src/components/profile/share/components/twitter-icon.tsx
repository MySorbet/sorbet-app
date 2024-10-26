import Image from 'next/image';

export const TwitterIcon = ({ className }: { className?: string }) => {
  return (
    <Image
      src='/images/social/twitter.svg'
      height={52}
      width={52}
      alt='Twitter logo'
      className={className}
    />
  );
};
