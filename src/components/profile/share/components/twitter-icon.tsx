import Image from 'next/image';

export const TwitterIcon = ({ className }: { className?: string }) => {
  return (
    <Image
      src='/svg/social/twitter.svg'
      height={52}
      width={52}
      alt='Twitter logo'
      className={className}
    />
  );
};
