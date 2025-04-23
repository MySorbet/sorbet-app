import React, { useState } from 'react';

import { cn } from '@/lib/utils';

interface FileDropAreaProps {
  onFileDrop: (file: File) => void;
  children: React.ReactNode;
  className?: string;
}

/**
 * Wrap your component in this to detect when a file is dragged over, indicate that a user can drop, and get a callback when a file is dropped.
 *
 * Note: This is taken mostly from Widgets 1.0 and could be updated.
 */
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
        'opacity-100 transition-opacity duration-300 ease-out',
        fileEnter && 'opacity-50',
        className
      )}
    >
      {children}
    </div>
  );
};
