import { Glyph, GlyphType } from '@/components/common/glyph/glyph';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

import WireframeGlobe from './wireframe-globe.svg';

/** On large screens, lay out children to the left of a hero graphic. On small screens render just the children. */
export const SigninHeroLayout = ({
  children,
  className,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <div className={cn('flex items-center justify-center gap-6', className)}>
      {children}
      <HeroGraphic className='hidden lg:flex' />
    </div>
  );
};

/** Right side graphic with value prop */
const HeroGraphic = ({ className }: { className?: string }) => {
  return (
    <div
      className={cn(
        'relative flex h-full max-w-2xl flex-1 flex-col items-center justify-center overflow-clip rounded-xl bg-black p-6 py-12',
        className
      )}
    >
      <ScrollArea>
        <div className='flex max-w-[26.5rem] flex-col gap-24'>
          <div className='space-y-6'>
            <h1 className='text-4xl font-bold text-white'>
              Borderless Payments for Individuals and Businesses
            </h1>
            <p className='text-lg font-normal text-white'>
              Collect from clients and pay contractors, same day, in USD, EUR,
              or USDC. One simple platform.
            </p>
          </div>
          <div className='flex flex-col gap-6'>
            <FeatureBullet
              glyphType='asterisk'
              title='Multi-Currency Account'
              subtitle='Get a free USD/EUR account in minutes and start collecting from global clients.'
            />
            <FeatureBullet
              glyphType='wink'
              title='Faster Payment, Less Fees'
              subtitle='Same-day payment collection for near-zero fees. The most efficient payment collection tool.'
            />
            <FeatureBullet
              glyphType='square'
              title='Security by Design'
              subtitle='Your money is completely in your control. Nobody can access it, not even us.'
            />
          </div>
        </div>
      </ScrollArea>
      <Glyph
        type='petal'
        className='absolute left-16 top-16 size-11 translate-x-1/2 translate-y-1/2 -rotate-[15deg] text-gray-400'
      />
      <Glyph
        type='arrow'
        className='absolute right-24 top-16 size-28 -translate-y-1/2 translate-x-1/2 rotate-[15deg] text-gray-400'
      />
      <WireframeGlobe className='scale-140 absolute bottom-0 right-0 translate-x-1/2 translate-y-1/2' />
    </div>
  );
};
/** Feature bullet component for hero section */
const FeatureBullet = ({
  glyphType,
  title,
  subtitle,
}: {
  glyphType: GlyphType;
  title: string;
  subtitle: string;
}) => {
  return (
    <div className='flex items-start gap-4'>
      <div className='flex-shrink-0'>
        <Glyph type={glyphType} className='size-6 text-white' />
      </div>
      <div className='flex flex-col gap-2'>
        <h3 className='text-xl font-bold leading-none text-white'>{title}</h3>
        <p className='text-muted-foreground text-base font-normal text-gray-400'>
          {subtitle}
        </p>
      </div>
    </div>
  );
};
