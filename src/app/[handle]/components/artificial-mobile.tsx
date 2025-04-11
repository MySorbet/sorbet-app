import { motion, useAnimationControls } from 'framer-motion';
import { useEffect, useRef } from 'react';

import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

/**
 * Fills width and height and renders children inside.
 *
 * When `isMobile` is true, transitions to an artificial mobile container and renders children inside.
 *
 * TODO: Consider a top and bottom safe area with a feathered edge to more realistically show mobile and fox scrollbar cut
 */
export const ArtificialMobile = ({
  isMobile,
  duration = 0.4,
  children,
  className,
  ...props
}: {
  /** Whether the container is in mobile mode. */
  isMobile?: boolean;
  /** Duration of the transition animation in seconds. Use `0` to disable. Defaults to `0.4` */
  duration?: number;
  /** Duration of the flash animation in seconds. Use `0` to disable. Defaults to `duration * 2.1` */
  flashDuration?: number | false;
  children?: React.ReactNode;
  className?: string;
}) => {
  const isInitialMount = useRef(true);
  const prevIsMobile = useRef(isMobile);
  const flashControls = useAnimationControls();

  const flashDuration = props.flashDuration ?? duration * 2.1;

  // Track changes to isMobile and trigger flash animation when it changes (but not on mount)
  useEffect(() => {
    if (flashDuration === false) {
      return;
    }

    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    if (prevIsMobile.current !== isMobile) {
      // Trigger flash animation
      flashControls.start('flash');
    }

    prevIsMobile.current = isMobile;
  }, [isMobile, flashControls, flashDuration]);

  // Animation variants
  const containerVariants = {
    mobile: {
      borderWidth: '2px',
      borderRadius: '40px',
      borderColor: 'hsl(var(--border))',
    },
    desktop: {
      borderWidth: '0px',
      borderRadius: '0px',
      borderColor: 'transparent',
    },
  };

  const flashVariants = {
    initial: { opacity: 1 },
    flash: {
      opacity: [1, 0, 0, 1],
      transition: {
        duration: flashDuration,
        times: [0, 0, 0.7, 1],
      },
    },
  };

  return (
    // Root full size container which transitions the padding
    <div
      className={cn(
        'bg-muted/70 flex size-full flex-col items-center justify-center',
        isMobile && 'py-12',
        className
      )}
    >
      {/* Artificial Mobile container transitions everything else */}
      <motion.div
        className={cn(
          'bg-background size-full overflow-clip',
          isMobile && 'max-h-[48rem] w-[28rem] py-8 shadow-sm'
        )}
        layout
        initial={false}
        animate={isMobile ? 'mobile' : 'desktop'}
        variants={containerVariants}
        transition={{ duration, ease: 'easeInOut' }}
      >
        {/* Full size container handles the flash during transition. */}
        <motion.div
          className='size-full'
          initial={false}
          animate={flashControls}
          variants={flashVariants}
        >
          {/* Scroll area only in mobile mode (Note: this causes a remount of children. If this is an issue, take a style approach) */}
          {isMobile ? (
            <ScrollArea className='size-full [mask-image:linear-gradient(to_bottom,transparent,black_32px,black_calc(100%-32px),transparent)]'>
              {children}
            </ScrollArea>
          ) : (
            children
          )}
        </motion.div>
      </motion.div>
    </div>
  );
};
