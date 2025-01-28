import Image from 'next/image';

export const InstagramIcon = ({ className }: { className?: string }) => {
  return (
    <Image
      src='/svg/social/instagram.svg'
      height={52}
      width={52}
      alt='Instagram logo'
      className={className}
    />
  );
};
