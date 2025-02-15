'use client';

import type { Variants } from 'motion/react';
import { motion, useAnimation } from 'motion/react';
import type { HTMLAttributes } from 'react';
import { forwardRef, useCallback, useImperativeHandle, useRef } from 'react';

export interface ArrowLeftRightIconHandle {
  startAnimation: () => void;
  stopAnimation: () => void;
}

const pathVariants: Variants = {
  normal: { d: 'M8 3 4 7l4 4', translateX: 0 },
  animate: {
    d: 'M8 3 4 7l4 4',
    translateX: [0, 3, 0],
    transition: {
      duration: 0.4,
    },
  },
};

const secondPathVariants: Variants = {
  normal: { d: 'M4 7 L20 7' },
  animate: {
    d: ['M4 7 L20 7', 'M7 7 L17 7', 'M4 7 L20 7'],
    transition: {
      duration: 0.4,
    },
  },
};

// arrow bottom
const pathVariantsBottom: Variants = {
  normal: { d: 'm16 21 4-4-4-4', translateX: 0 },
  animate: {
    d: 'm16 21 4-4-4-4',
    translateX: [0, -3, 0],
    transition: {
      duration: 0.4,
    },
  },
};

const secondPathVariantsBottom: Variants = {
  normal: { d: 'M20 17 L4 17' },
  animate: {
    d: ['M20 17 L4 17', 'M17 17 L7 17', 'M20 17 L4 17'],
    transition: {
      duration: 0.4,
    },
  },
};

const ArrowLeftRightIcon = forwardRef<
  ArrowLeftRightIconHandle,
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
      {/* <svg
        xmlns='http://www.w3.org/2000/svg'
        width='28'
        height='28'
        viewBox='0 0 24 24'
        fill='none'
        stroke='currentColor'
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
      >
        <motion.path
          d='m12 19-7-7 7-7'
          variants={pathVariants}
          animate={controls}
        />

        <motion.path
          d='M19 12H5'
          variants={secondPathVariants}
          animate={controls}
        />
      </svg> */}
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
        <motion.path
          d='M8 3 4 7l4 4'
          variants={pathVariants}
          animate={controls}
        />
        <motion.path
          d='M4 7 L20 7'
          variants={secondPathVariants}
          animate={controls}
        />

        <motion.path
          d='m16 21 4-4-4-4'
          variants={pathVariantsBottom}
          animate={controls}
        />
        <motion.path
          d='M20 17 L4 17'
          variants={secondPathVariantsBottom}
          animate={controls}
        />
      </svg>
    </div>
  );
});

ArrowLeftRightIcon.displayName = 'ArrowLeftRightIcon';

export { ArrowLeftRightIcon };
