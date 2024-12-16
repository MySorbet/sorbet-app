import { Image03 } from '@untitled-ui/icons-react';
import { Trash2 } from 'lucide-react';
import { Dispatch, SetStateAction } from 'react';
import React from 'react';

import { checkFileValid } from '@/components/profile/widgets/util';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

interface ModifyImageControlsProps {
  identifier: string;
  hasImage: boolean;
  addImage: (key: string, image: File) => Promise<void>;
  removeImage: (key: string) => Promise<void>;
  setErrorInvalidImage: Dispatch<SetStateAction<boolean>>;
  restoreImage?: (event: React.MouseEvent<HTMLDivElement>) => void;
}

/**
 * Component that appears above the contents of any given widget to
 * provide the option to replace the widget's content image, remove it,
 * or restore it to the website's scraped image.
 */
export const ModifyImageControls: React.FC<ModifyImageControlsProps> = ({
  identifier,
  hasImage,
  addImage,
  removeImage,
  setErrorInvalidImage,
  restoreImage,
}) => {
  const btnClass = 'h-4 w-7 flex items-center justify-center';
  const dividerClass = 'h-4 w-[2.5px] bg-[#344054] rounded-full mx-2';

  const handleAddImageClick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const valid = checkFileValid(file);
    if (valid) {
      // Pass in identifier so the correct widget is modified (for handleNewImageAdd)
      addImage(identifier, file);
    } else {
      setErrorInvalidImage(true);
    }
  };

  const handleImageRemove = () => {
    removeImage(identifier);
  };

  return (
    <div className='align-center absolute left-1/2 top-0 z-20 flex min-h-[36px] -translate-x-1/2 -translate-y-1/2 transform cursor-pointer flex-row items-center justify-center rounded-full bg-[#667085] px-2 text-white opacity-0 transition-opacity group-hover:opacity-100'>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <div className={btnClass}>
              <label>
                <input
                  type='file'
                  className='hidden'
                  onChange={handleAddImageClick}
                  accept='image/*'
                />
                <Image03 width={26} height={26} strokeWidth={2.5} />
              </label>
            </div>
          </TooltipTrigger>
          <TooltipContent>Add custom picture</TooltipContent>
        </Tooltip>
      </TooltipProvider>
      {hasImage ? (
        <>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <div className={btnClass} onClick={restoreImage}>
                  <LinkedPictureIcon className='size-6 text-white' />
                </div>
              </TooltipTrigger>
              <TooltipContent>Use website picture</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <div className={dividerClass} />
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <div className={btnClass} onClick={handleImageRemove}>
                  <Trash2 size={22} />
                </div>
              </TooltipTrigger>
              <TooltipContent>Delete picture</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </>
      ) : (
        <>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <div className={btnClass} onClick={restoreImage}>
                  <LinkedPictureIcon className='size-6 text-white' />
                </div>
              </TooltipTrigger>
              <TooltipContent>Use website picture</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </>
      )}
    </div>
  );
};

interface LinkedPictureIconProps {
  className?: string;
  width?: number | string;
  height?: number | string;
}

const LinkedPictureIcon: React.FC<LinkedPictureIconProps> = ({ className }) => {
  return (
    <svg
      viewBox='0 0 24 24'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      className={cn(`cursor-pointer transition-colors`, className)}
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
