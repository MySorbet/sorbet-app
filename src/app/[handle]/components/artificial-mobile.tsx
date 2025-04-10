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
  duration = 0.3,
  children,
  className,
  ...props
}: {
  /** Whether the container is in mobile mode. */
  isMobile?: boolean;
  /** Duration of the transition animation. Use `0` to disable. Defaults to `0.3` */
  duration?: number;
  /** Duration of the flash animation. Use `0` to disable. Defaults to `duration * 2` */
  flashDuration?: number;
  children?: React.ReactNode;
  className?: string;
}) => {
  const isInitialMount = useRef(true);
  const prevIsMobile = useRef(isMobile);
  const flashControls = useAnimationControls();

  const mobileWidth = '380px';
  const flashDuration = props.flashDuration ?? duration * 2;

  // Track changes to isMobile and trigger flash animation when it changes (but not on mount)
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    if (prevIsMobile.current !== isMobile) {
      // Trigger flash animation
      flashControls.start('flash');
    }

    prevIsMobile.current = isMobile;
  }, [isMobile, flashControls]);

  // Animation variants
  const containerVariants = {
    mobile: {
      width: mobileWidth,
      borderWidth: '2px',
      borderRadius: '40px',
    },
    desktop: {
      width: '100%',
      borderWidth: '0px',
      borderRadius: '0px',
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
        'bg-muted/70 size-full transition-[padding]',
        isMobile && 'py-12',
        className
      )}
      style={{ transitionDuration: `${duration}s` }}
    >
      {/* Artificial Mobile container transitions everything else */}
      <motion.div
        className={cn(
          'bg-background mx-auto size-full border-transparent transition-[border-color]',
          isMobile && 'border-muted overflow-clip border-2 py-6 shadow-sm'
        )}
        style={{ transitionDuration: `${duration}s` }}
        initial={isMobile ? 'mobile' : 'desktop'}
        animate={isMobile ? 'mobile' : 'desktop'}
        variants={containerVariants}
        transition={{ duration, ease: 'easeOut' }}
      >
        {/* Full size container handles the flash during transition. */}
        <motion.div
          className='size-full'
          initial='initial'
          animate={flashControls}
          variants={flashVariants}
        >
          {/* Scroll area only in mobile mode (TODO: This causes rerenders, is that ok?) */}
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
