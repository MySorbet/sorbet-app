'use client';

import { motion } from 'framer-motion';
import { CircleX } from 'lucide-react';

interface FilePreviewProps {
  file: string;
  removeFile: () => void;
}

const FilePreview = ({ file, removeFile }: FilePreviewProps) => {
  return (
    <motion.div
      initial={{ scale: 0.5, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
      transition={{
        opacity: { duration: 0.02 },
        layout: {
          type: 'spring',
          stiffness: 700,
          damping: 30,
        },
      }}
      className='relative h-12 w-16 overflow-hidden rounded-lg border border-gray-400 p-0'
    >
      <button className='' onClick={() => removeFile()}>
        <CircleX className='absolute left-[1px] top-[1px] z-20 h-4 w-4 text-white' />
        <div className='absolute left-[1px] top-[1px] z-10 h-4 w-4 rounded-full bg-gray-500' />
      </button>
      <img
        src={file}
        alt='file'
        className='absolute top-0 h-full w-full object-cover '
      />
    </motion.div>
  );
};

export { FilePreview };
