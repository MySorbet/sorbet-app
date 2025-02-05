'use client';

import type { Variants } from 'motion/react';
import { motion, useAnimation } from 'motion/react';
import type { HTMLAttributes } from 'react';
import { forwardRef, useCallback, useImperativeHandle, useRef } from 'react';

export interface SquareUserIconHandle {
  startAnimation: () => void;
  stopAnimation: () => void;
}

const pathVariant: Variants = {
  normal: { pathLength: 1, opacity: 1, pathOffset: 0 },
  animate: {
    pathLength: [0, 1],
    opacity: [0, 1],
    pathOffset: [1, 0],
  },
};

const circleVariant: Variants = {
  normal: {
    pathLength: 1,
    pathOffset: 0,
    scale: 1,
  },
  animate: {
    pathLength: [0, 1],
    pathOffset: [1, 0],
    scale: [0.5, 1],
  },
};

const SquareUserIcon = forwardRef<
  SquareUserIconHandle,
  HTMLAttributes<HTMLDivElement>
>(({ onMouseEnter, onMouseLeave, ...props }, ref) => {
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
      if (!isControlledRef.current) {
        controls.start('animate');
      } else {
        onMouseEnter?.(e);
      }
    },
    [controls, onMouseEnter]
  );

  const handleMouseLeave = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!isControlledRef.current) {
        controls.start('normal');
      } else {
        onMouseLeave?.(e);
      }
    },
    [controls, onMouseLeave]
  );
  return (
    <div
      className='hover:bg-accent flex cursor-pointer select-none items-center justify-center rounded-md p-2 transition-colors duration-200'
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      <svg
        xmlns='http://www.w3.org/2000/svg'
        width='24'
        height='24'
        viewBox='0 0 24 24'
        fill='none'
        stroke='currentColor'
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
      >
        <rect width='18' height='18' x='3' y='3' rx='2' />
        <motion.circle
          cx='12'
          cy='10'
          r='3'
          animate={controls}
          variants={circleVariant}
        />
        <motion.path
          d='M7 21v-2a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v2'
          variants={pathVariant}
          animate={controls}
          transition={{
            delay: 0.2,
            duration: 0.4,
          }}
        />
      </svg>
    </div>
  );
});

SquareUserIcon.displayName = 'SquareUserIcon';

export { SquareUserIcon };
