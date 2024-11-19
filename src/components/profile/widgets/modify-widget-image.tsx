import { Image03, LinkExternal02 } from '@untitled-ui/icons-react';
import { Trash2 } from 'lucide-react';
import Image from 'next/image';
import { Dispatch, SetStateAction } from 'react';

import { cn } from '@/lib/utils';

interface ModifyImageWidgetProps {
  identifier: string;
  hasImage: boolean;
  addImage: (key: string, image: File) => Promise<void>;
  removeImage: (key: string) => Promise<void>;
  setErrorInvalidImage: Dispatch<SetStateAction<boolean>>;
  openWidgetLink?: (event: React.MouseEvent<HTMLDivElement>) => void;
  className?: string;
}

export const ModifyImageWidget: React.FC<ModifyImageWidgetProps> = ({
  identifier,
  hasImage,
  addImage,
  removeImage,
  setErrorInvalidImage,
  openWidgetLink,
  className,
}) => {
  const btnClass = 'h-4 w-7 flex items-center justify-center';
  const dividerClass = 'h-4 w-[2.5px] bg-[#344054] rounded-full mx-2';

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : undefined;
    if (file) {
      const validExtensions = ['jpg', 'jpeg', 'png', 'gif', 'svg'];
      const fileSize = file.size / 1024 / 1024; // in MB
      const fileExtension = file.name.split('.').pop()?.toLowerCase();

      if (!fileExtension) {
        return;
      }
      if (validExtensions.includes(fileExtension) && fileSize <= 10) {
        addImage(identifier, file);
      } else {
        setErrorInvalidImage(true);
      }
    } else {
      setErrorInvalidImage(true);
    }
  };

  const handleImageRemove = () => {
    removeImage(identifier);
  };

  return (
    <div
      className={cn(
        'align-center z-20 hidden min-h-[36px] cursor-pointer flex-row items-center justify-center rounded-full bg-[#667085] px-2 text-white',
        className
      )}
    >
      <div className={btnClass}>
        <label>
          <input
            type='file'
            className='hidden'
            onChange={handleImageUpload}
            accept='image/*'
          />
          <Image03 width={24} height={24} strokeWidth={2.5} />
        </label>
      </div>
      {hasImage ? (
        <>
          <div className={btnClass} onClick={openWidgetLink}>
            <LinkedPictureIcon className='text-white' />
          </div>

          <div className={dividerClass} />
          <div className={btnClass} onClick={handleImageRemove}>
            <Trash2 size={18} />
          </div>
        </>
      ) : (
        <>
          <div className={dividerClass} />
          <div className={btnClass} onClick={openWidgetLink}>
            <LinkedPictureIcon className='text-[#344054]' />
          </div>
        </>
      )}
    </div>
  );
};

import React from 'react';

interface LinkedPictureIconProps {
  className?: string;
  width?: number | string;
  height?: number | string;
}

const LinkedPictureIcon: React.FC<LinkedPictureIconProps> = ({
  className,
  width = 24,
  height = 24,
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox='0 0 24 24'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      className={`cursor-pointer transition-colors ${className}`}
    >
      <g clipPath='url(#clip0_1304_3008)'>
        <path
          d='M12.4134 15.7122L11.5884 16.5372C10.4494 17.6763 8.60267 17.6763 7.46365 16.5372C6.32462 15.3982 6.32462 13.5515 7.46365 12.4124L8.2886 11.5875M15.7132 12.4124L16.5382 11.5875C17.6772 10.4484 17.6772 8.6017 16.5382 7.46267C15.3992 6.32364 13.5524 6.32364 12.4134 7.46267L11.5884 8.28763M9.95925 14.0416L14.0426 9.95826'
          stroke='currentColor'
          strokeWidth='2'
          strokeLinecap='round'
          strokeLinejoin='round'
        />
      </g>
      <path
        d='M8 3H7.8C6.11984 3 5.27976 3 4.63803 3.32698C4.07354 3.6146 3.6146 4.07354 3.32698 4.63803C3 5.27976 3 6.11984 3 7.8V8M8 21H7.8C6.11984 21 5.27976 21 4.63803 20.673C4.07354 20.3854 3.6146 19.9265 3.32698 19.362C3 18.7202 3 17.8802 3 16.2V16M21 8V7.8C21 6.11984 21 5.27976 20.673 4.63803C20.3854 4.07354 19.9265 3.6146 19.362 3.32698C18.7202 3 17.8802 3 16.2 3H16M21 16V16.2C21 17.8802 21 18.7202 20.673 19.362C20.3854 19.9265 19.9265 20.3854 19.362 20.673C18.7202 21 17.8802 21 16.2 21H16'
        stroke='currentColor'
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <defs>
        <clipPath id='clip0_1304_3008'>
          <rect
            width='14'
            height='14'
            fill='white'
            transform='translate(5 5)'
          />
        </clipPath>
      </defs>
    </svg>
  );
};
