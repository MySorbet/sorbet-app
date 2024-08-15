import Image from 'next/image';

export const DemoImage = ({ src, alt }: { src: any; alt: string }) => {
  return (
    <Image
      src={src}
      height={186}
      width={368}
      alt={alt}
      className='w-auto rounded-3xl object-cover'
    />
  );
};
