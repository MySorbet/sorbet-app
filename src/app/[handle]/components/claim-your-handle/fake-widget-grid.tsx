import { cn } from '@/lib/utils';

import { Widget } from '../widget/widget';
import styles from './float.module.css';

interface FakeWidgetGridProps {
  /** Whether the widgets should animate. Overridden by `prefers-reduced-motion`. */
  animated?: boolean;
}

const FakePhotoWidget = ({ className }: { className?: string }) => {
  return <div className={cn('bg-muted rounded-2xl shadow-sm', className)} />;
};

export const FakeWidgetGrid = ({ animated = false }: FakeWidgetGridProps) => {
  return (
    <div
      className='@5xl:grid-cols-[repeat(4,175px)] @5xl:gap-10 pointer-events-none grid h-full w-fit max-w-3xl grid-cols-[repeat(2,175px)] gap-5 p-4 opacity-60'
      style={{
        gridAutoRows: '175px',
      }}
      role='presentation'
    >
      <div
        className={cn(
          'col-span-2 row-span-2',
          styles.floatingWidget,
          animated && styles.animate
        )}
      >
        <Widget
          title='Dribbble'
          href='https://dribbble.com/username'
          size='A'
        />
      </div>
      <div
        className={cn(
          'col-span-1 row-span-1',
          styles.floatingWidget,
          animated && styles.animate,
          styles.delay1
        )}
      >
        <Widget title='Behance' href='https://behance.net/username' size='B' />
      </div>
      <div
        className={cn(
          'col-span-1 row-span-2',
          styles.floatingWidget,
          animated && styles.animate,
          styles.delay2
        )}
      >
        <Widget title='Spotify' href='https://spotify.com/username' size='C' />
      </div>
      <FakePhotoWidget
        className={cn(
          'col-span-1 row-span-2',
          styles.floatingWidget,
          animated && styles.animate,
          styles.delay3
        )}
      />
      <div
        className={cn(
          'col-span-2 row-span-1',
          styles.floatingWidget,
          animated && styles.animate,
          styles.delay4
        )}
      >
        <Widget
          title='Instagram'
          href='https://instagram.com/username'
          size='D'
        />
      </div>
      <FakePhotoWidget
        className={cn(
          'col-span-1 row-span-1',
          styles.floatingWidget,
          animated && styles.animate,
          styles.delay1
        )}
      />
      <FakePhotoWidget
        className={cn(
          'col-span-1 row-span-1',
          styles.floatingWidget,
          animated && styles.animate,
          styles.delay2
        )}
      />
      <div
        className={cn(
          'col-span-1 row-span-2',
          styles.floatingWidget,
          animated && styles.animate,
          styles.delay3
        )}
      >
        <Widget title='Youtube' href='https://youtube.com/username' size='C' />
      </div>
      <div
        className={cn(
          'col-span-2 row-span-1',
          styles.floatingWidget,
          animated && styles.animate,
          styles.delay4
        )}
      >
        <Widget
          title='Twitter/X'
          href='https://twitter.com/username'
          size='D'
        />
      </div>
    </div>
  );
};
