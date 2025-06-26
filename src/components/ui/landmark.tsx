'use client';

import type { Variants } from 'motion/react';
import { motion, useAnimation } from 'motion/react';
import type { HTMLAttributes } from 'react';
import { forwardRef, useCallback, useImperativeHandle, useRef } from 'react';
import { cn } from '@/lib/utils';

export interface LandmarkIconHandle {
  startAnimation: () => void;
  stopAnimation: () => void;
}

interface LandmarkIconProps extends HTMLAttributes<HTMLDivElement> {
  size?: number;
}

const spring = {
  delay: 0.1,
  type: 'spring',
  stiffness: 200,
  damping: 13,
};

const pathVariant1: Variants = {
  normal: {
    translateX: 0,
    transition: {
      ...spring,
    },
  },
  animate: {
    translateX: -2,
    transition: {
      ...spring,
    },
  },
};

const pathVariant2: Variants = {
  normal: {
    translateX: 0,
    transition: {
      ...spring,
    },
  },
  animate: {
    translateX: -1,
    transition: {
      ...spring,
    },
  },
};

const pathVariant3: Variants = {
  normal: {
    translateX: 0,
    transition: {
      ...spring,
    },
  },
  animate: {
    translateX: 1,
    transition: {
      ...spring,
    },
  },
};

const pathVariant4: Variants = {
  normal: {
    translateX: 0,
    transition: {
      ...spring,
    },
  },
  animate: {
    translateX: 2,
    transition: {
      ...spring,
    },
  },
};

const LandmarkIcon = forwardRef<LandmarkIconHandle, LandmarkIconProps>(
  ({ onMouseEnter, onMouseLeave, className, size = 28, ...props }, ref) => {
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
        className={cn(className)}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        {...props}
      >
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width={size}
          height={size}
          viewBox='0 0 24 24'
          fill='none'
          stroke='currentColor'
          strokeWidth='2'
          strokeLinecap='round'
          strokeLinejoin='round'
        >
          <path d='M11.12 2.198a2 2 0 0 1 1.76.006l7.866 3.847c.476.233.31.949-.22.949H3.474c-.53 0-.695-.716-.22-.949z' />
          <path d='M3 22h18' />

          <motion.path d='M6 18v-7' variants={pathVariant1} animate={controls} />
          <motion.path d='M10 18v-7' variants={pathVariant2} animate={controls} />
          <motion.path d='M14 18v-7' variants={pathVariant3} animate={controls} />
          <motion.path d='M18 18v-7' variants={pathVariant4} animate={controls} />
        </svg>
      </div>
    );
  }
);

LandmarkIcon.displayName = 'LandmarkIcon';

export { LandmarkIcon };
