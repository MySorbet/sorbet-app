import { cn } from '@/lib/utils';

import arrow from './svg/arrow.svg';
import asterisk from './svg/asterisk.svg';
import diamond from './svg/diamond.svg';
import petal from './svg/petal.svg';
import square from './svg/square.svg';
import wink from './svg/wink.svg';

export const glyphs: Record<string, React.FC<React.SVGProps<SVGSVGElement>>> = {
  asterisk: asterisk,
  wink: wink,
  petal: petal,
  arrow: arrow,
  square: square,
  diamond: diamond,
};

export type GlyphType = keyof typeof glyphs;

export const Glyph = ({
  type,
  className,
}: {
  type?: GlyphType;
  className?: string;
}) => {
  const GlyphComponent = glyphs[type || 'asterisk'];
  return (
    <div>
      <GlyphComponent className={cn('size-10', className)} />
    </div>
  );
};
