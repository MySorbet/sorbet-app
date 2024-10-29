import Image from 'next/image';

export const InstagramIcon = ({ className }: { className?: string }) => {
  return (
    <Image
      src='/images/social/instagram.svg'
      height={52}
      width={52}
      alt='Instagram logo'
      className={className}
    />
  );
};
