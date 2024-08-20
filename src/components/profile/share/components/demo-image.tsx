import { StaticImport } from 'next/dist/shared/lib/get-img-props';
import Image from 'next/image';

export const DemoImage = ({ src, alt }: { src: string | StaticImport; alt: string }) => {
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
