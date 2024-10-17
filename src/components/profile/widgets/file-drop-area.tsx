import React, { useState } from 'react';

import { cn } from '@/lib/utils';

interface FileDropAreaProps {
  onFileDrop: (file: File) => void;
  children: React.ReactNode;
  className?: string;
}

export const FileDropArea: React.FC<FileDropAreaProps> = ({
  onFileDrop,
  children,
  className,
}) => {
  const [fileEnter, setFileEnter] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setFileEnter(true);
  };

  const handleDragLeave = () => {
    setFileEnter(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setFileEnter(false);
    if (e.dataTransfer.items) {
      [...e.dataTransfer.items].forEach((item) => {
        if (item.kind === 'file') {
          const file = item.getAsFile();
          if (file) {
            onFileDrop(file);
          }
        }
      });
    } else if (e.dataTransfer.files.length > 0) {
      onFileDrop(e.dataTransfer.files[0]);
    }
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDragEnd={handleDragLeave}
      onDrop={handleDrop}
      className={cn(
        'rounded-3xl transition-all duration-300 ease-out',
        'border-2 border-dashed',
        fileEnter
          ? 'scale-[1.01] border-[#D7D7D7]'
          : 'scale-100 border-transparent shadow-none',
        className
      )}
    >
      {children}
    </div>
  );
};
