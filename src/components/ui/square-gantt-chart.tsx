'use client';

import type { Variants } from 'motion/react';
import { motion, useAnimation } from 'motion/react';
import type { HTMLAttributes } from 'react';
import { forwardRef, useCallback, useImperativeHandle, useRef } from 'react';

export interface SquareGanttChartIconHandle {
  startAnimation: () => void;
  stopAnimation: () => void;
}

const lineVariants: Variants = {
  visible: { pathLength: 1, opacity: 1 },
  hidden: { pathLength: 0, opacity: 0 },
};

const SquareGanttChartIcon = forwardRef<
  SquareGanttChartIconHandle,
  HTMLAttributes<HTMLDivElement>
>(({ onMouseEnter, onMouseLeave, ...props }, ref) => {
  const controls = useAnimation();
  const isControlledRef = useRef(false);

  useImperativeHandle(ref, () => {
    isControlledRef.current = true;

    return {
      startAnimation: async () => {
        await controls.start((i) => ({
          pathLength: 0,
          opacity: 0,
          transition: { delay: i * 0.1, duration: 0.3 },
        }));
        await controls.start((i) => ({
          pathLength: 1,
          opacity: 1,
          transition: { delay: i * 0.1, duration: 0.3 },
        }));
      },
      stopAnimation: () => controls.start('visible'),
    };
  });

  const handleMouseEnter = useCallback(
    async (e: React.MouseEvent<HTMLDivElement>) => {
      if (!isControlledRef.current) {
        await controls.start((i) => ({
          pathLength: 0,
          opacity: 0,
          transition: { delay: i * 0.1, duration: 0.3 },
        }));
        await controls.start((i) => ({
          pathLength: 1,
          opacity: 1,
          transition: { delay: i * 0.1, duration: 0.3 },
        }));
      } else {
        onMouseEnter?.(e);
      }
    },
    [controls, onMouseEnter]
  );

  const handleMouseLeave = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!isControlledRef.current) {
        controls.start('visible');
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
        <motion.path
          d='M9 8h7'
          variants={lineVariants}
          initial='visible'
          animate={controls}
          custom={1}
        />
        <motion.path
          d='M8 12h6'
          variants={lineVariants}
          initial='visible'
          animate={controls}
          custom={2}
        />
        <motion.path
          d='M11 16h5'
          variants={lineVariants}
          initial='visible'
          animate={controls}
          custom={3}
        />
      </svg>
    </div>
  );
});

SquareGanttChartIcon.displayName = 'SquareGanttChartIcon';

export { SquareGanttChartIcon };
