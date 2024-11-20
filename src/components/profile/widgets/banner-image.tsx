import { ImageOverlay } from '@/components/profile/widgets/image-overlay';
import { cn } from '@/lib/utils';

/**
 * Local component to render the banner image for the link.
 */
export const BannerImage: React.FC<{ src?: string; className?: string }> = ({
  src,
  className,
}) => {
  return (
    <div
      className={cn(
        'relative flex h-full w-full items-center justify-center overflow-hidden rounded-2xl',
        !src && 'bg-gray-100',
        className
      )}
    >
      {!src && (
        <div className='absolute inset-0 bg-[url("/svg/empty-widget-background.svg")] bg-cover bg-center opacity-50' />
      )}
      {src && src !== '' ? (
        <>
          <img
            src={src}
            alt='Banner image from url'
            className='absolute inset-0 h-full w-full rounded-xl object-cover'
          />
          <ImageOverlay />
        </>
      ) : (
        <span className='text-sm font-semibold text-[#344054]'>
          Nothing to see here
        </span>
      )}
    </div>
  );
};
