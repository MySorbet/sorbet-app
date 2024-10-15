import { cn } from '@/lib/utils';
import React, { useState } from 'react';

interface FileDropAreaProps {
  onFileDrop: (file: File) => void;
  children: React.ReactNode;
}

export const FileDropArea: React.FC<FileDropAreaProps> = ({
  onFileDrop,
  children,
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
        'rounded-3xl',
        fileEnter && 'border-2 border-dashed border-[#D7D7D7]'
      )}
    >
      {children}
    </div>
  );
};
