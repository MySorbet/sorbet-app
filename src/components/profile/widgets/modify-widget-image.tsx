import React, { useState } from 'react';
import {
  RectangleHorizontal,
  RectangleVertical,
  Square,
  Crop,
  Trash2,
} from 'lucide-react';
import { WidgetDimensions, WidgetSize } from '@/types';
import { AddLink } from '@/components/profile/widgets/add-link';
import { CropImageDialog } from '@/components/profile/widgets/crop-image-dialog';
import { Image03, LinkExternal02 } from '@untitled-ui/icons-react';
import { cn } from '@/lib/utils';

interface ModifyImageWidgetProps {
  // setActiveWidget: (identifier: string | null) => void;
  // activeWidget: string | null;
  identifier: string;
  addUrl: any;

  className?: string;
}

export const ModifyImageWidget: React.FC<ModifyImageWidgetProps> = ({
  identifier,
  // activeWidget,
  className,
  addUrl,
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
        // This condition is hit if there is no file extension
        // showErrorInvalidImage(true);
        return;
      }

      if (validExtensions.includes(fileExtension) && fileSize <= 10) {
        addUrl(identifier, file);
      } else {
        // showErrorInvalidImage(true);
        console.error('bleh');
      }
    }
  };

  return (
    <div
      className={cn(
        'align-center z-20 flex hidden min-h-[36px] min-w-[112px] cursor-pointer flex-row items-center justify-center rounded-full bg-[#667085] text-white',
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
          <Image03 width={16} height={16} strokeWidth={2.5} />
        </label>
      </div>
      <div className={btnClass}>
        <LinkExternal02 width={16} height={16} strokeWidth={2.5} />
      </div>

      <div className={dividerClass} />
      <div className={btnClass}>
        <Trash2 size={18} />
      </div>
    </div>
  );
};
