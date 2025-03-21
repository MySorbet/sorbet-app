import { RectangleHorizontal, RectangleVertical, Square } from 'lucide-react';

import { cn } from '@/lib/utils';

import { WidgetSize } from './grid-config';

// TODO: There is a lot to do here:
// Add image controls
// integrate better with design tokens
// better animations (maybe use a slider like in tabs component)
// stroke is strange on the squares

/**
 * Size controls for a widget ordered B, D, C, A
 */
export const WidgetControls = ({
  size,
  onSizeChange,
}: {
  size: WidgetSize;
  onSizeChange: (size: WidgetSize) => void;
}) => {
  return (
    <div
      className={cn(
        'flex items-center justify-center gap-1 rounded-lg bg-[#18181B] p-1 shadow-lg'
      )}
    >
      <SizeButton
        size='B'
        isActive={size === 'B'}
        onClick={() => onSizeChange('B')}
      >
        <Square size={11} />
      </SizeButton>
      <SizeButton
        size='D'
        isActive={size === 'D'}
        onClick={() => onSizeChange('D')}
      >
        <RectangleHorizontal size={19} />
      </SizeButton>

      <SizeButton
        size='C'
        isActive={size === 'C'}
        onClick={() => onSizeChange('C')}
      >
        <RectangleVertical size={19} />
      </SizeButton>
      <SizeButton
        size='A'
        isActive={size === 'A'}
        onClick={() => onSizeChange('A')}
      >
        <Square size={19} />
      </SizeButton>
    </div>
  );
};

const SizeButton = ({
  size,
  isActive,
  onClick,
  children,
}: {
  size: WidgetSize;
  isActive: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) => {
  return (
    <button
      className={cn(
        'flex size-6 items-center justify-center rounded-sm text-white',
        isActive && 'bg-[#D0ADFF] text-[#18181B]' // --purple-lightest
      )}
      onClick={onClick}
    >
      {children}
    </button>
  );
};
