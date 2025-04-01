'use client';

import type { Variants } from 'motion/react';
import { motion, useAnimation } from 'motion/react';
import type { HTMLAttributes } from 'react';
import { forwardRef, useCallback, useImperativeHandle, useRef } from 'react';

export interface LinkCheckIconHandle {
  startAnimation: () => void;
  stopAnimation: () => void;
}

const pathVariants: Variants = {
  normal: {
    pathLength: 1,
    scale: 1,
    transition: {
      duration: 0.5,
    },
  },
  animate: {
    pathLength: [0, 1],
    scale: [0.5, 1],
    transition: {
      duration: 0.5,
    },
  },
};

const linkPathVariants: Variants = {
  initial: { pathLength: 1, pathOffset: 0, rotate: 0 },
  animate: {
    pathLength: [1, 0.97, 1, 0.97, 1],
    pathOffset: [0, 0.05, 0, 0.05, 0],
    rotate: [0, -5, 0],
    transition: {
      rotate: {
        duration: 0.5,
      },
      duration: 0.8,
      times: [0, 0.2, 0.4, 0.6, 0.8],
      ease: 'easeInOut',
    },
  },
};

const LinkCheckIcon = forwardRef<
  LinkCheckIconHandle,
  HTMLAttributes<HTMLDivElement> & {
    /** Disables the animation that occurs on hover */
    disableHoverAnimation?: boolean;
  }
>(({ onMouseEnter, onMouseLeave, disableHoverAnimation = false, ...props }, ref) => {
  const controls = useAnimation();
  const isControlledRef = useRef(false);

  useImperativeHandle(ref, () => {
    isControlledRef.current = true;

    return {
      startAnimation: () => controls.start('animate'),
      stopAnimation: () => controls.start('normal'),
    };
  });

  const handleMouseEnter = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!isControlledRef.current && !disableHoverAnimation) {
        controls.start('animate');
      } else {
        onMouseEnter?.(e);
      }
    },
    [controls, onMouseEnter, disableHoverAnimation]
  );

  const handleMouseLeave = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!isControlledRef.current && !disableHoverAnimation) {
        controls.start('normal');
      } else {
        onMouseLeave?.(e);
      }
    },
    [controls, onMouseLeave, disableHoverAnimation]
  );

  return (
    <div
      className='hover:bg-accent flex cursor-pointer select-none items-center justify-center rounded-md p-2 transition-colors duration-200'
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      <svg
        width='24'
        height='24'
        viewBox='0 0 24 24'
        fill='none'
        xmlns='http://www.w3.org/2000/svg'
        stroke='currentColor'
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
      >
        <motion.path
          d='M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71'
          variants={linkPathVariants}
          animate={controls}
        />
        <motion.path
          d='M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07'
          variants={linkPathVariants}
          animate={controls}
        />
        <motion.path
          variants={pathVariants}
          initial='normal'
          animate={controls}
          d='M13.1665 18.5L15.8748 21.2083L21.8332 15.25'
        />
      </svg>
    </div>
  );
});

LinkCheckIcon.displayName = 'LinkCheckIcon';

export { LinkCheckIcon };
