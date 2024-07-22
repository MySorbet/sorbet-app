import { CircleX } from 'lucide-react';
import Image from 'next/image';
import { Dispatch, SetStateAction } from 'react';

interface FilePreviewProps {
  file: string;
  removeFile: () => void;
}

const FilePreview = ({ file, removeFile }: FilePreviewProps) => {
  return (
    <div className='relative h-12 w-16 rounded-lg overflow-hidden p-0 border border-gray-400'>
      <button className='' onClick={() => removeFile()}>
        <CircleX className='absolute top-[1px] left-[1px] h-4 w-4 text-white z-20' />
        <div className='absolute top-[1px] left-[1px] h-4 w-4 rounded-full bg-gray-500 z-10' />
      </button>
      <img
        src={file}
        alt='file'
        className='absolute top-0 w-full h-full object-cover '
      />
    </div>
  );
};

export { FilePreview };
