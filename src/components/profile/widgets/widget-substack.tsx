import React, { Dispatch, SetStateAction } from 'react';

import { BannerImage } from '@/components/profile/widgets/banner-image';
import { ModifyImageWidget } from '@/components/profile/widgets/modify-widget-image';
import {
  SubstackWidgetContentType,
  WidgetContentType,
  WidgetSize,
  WidgetType,
} from '@/types';

import { ImageOverlay } from './image-overlay';
import { WidgetIcon } from './widget-icon';

interface SubstackWidgetType {
  identifier: string;
  showControls?: boolean;
  setErrorInvalidImage: Dispatch<SetStateAction<boolean>>;
  addImage: (key: string, image: File) => Promise<void>;
  removeImage: (key: string) => Promise<void>;
  content: SubstackWidgetContentType;
  size: WidgetSize;
  redirectUrl?: string;
  handleRestoreImage: (
    key: string,
    type: WidgetType,
    redirectUrl: string,
    content: WidgetContentType
  ) => Promise<void>;
}

export const SubstackWidget: React.FC<SubstackWidgetType> = ({
  identifier,
  showControls,
  setErrorInvalidImage,
  addImage,
  removeImage,
  content,
  size,
  redirectUrl,
  handleRestoreImage,
}) => {
  let widgetLayout;

  const restoreImage = async () => {
    await handleRestoreImage(
      identifier,
      'Substack',
      redirectUrl ?? '',
      content
    ); // Call the mutation with the image URL
  };

  const localHeader = (
    <>
      <div className='text-sm font-semibold'>{content.title}</div>
      <div className='text-xs text-gray-500'>{content.host}</div>
    </>
  );

  switch (size) {
    case 'A':
      widgetLayout = (
        <div className='flex h-full flex-col gap-2'>
          <div className='flex flex-row gap-2'>
            <div className='w-8'>
              <WidgetIcon type='Substack' />
            </div>
            <div className='w-90'>{localHeader}</div>
          </div>
          <div className='relative flex-grow'>
            {showControls && (
              <ModifyImageWidget
                hasImage={content.image ? true : false}
                restoreImage={restoreImage}
                setErrorInvalidImage={setErrorInvalidImage}
                identifier={identifier}
                addImage={addImage}
                removeImage={removeImage}
                className='absolute left-1/2 top-0 z-20 flex -translate-x-1/2 -translate-y-1/2 transform items-center opacity-0 transition-opacity group-hover:opacity-100'
              />
            )}
            <BannerImage src={content.image} />
          </div>
        </div>
      );
      break;
    case 'B':
      widgetLayout = (
        <div className='flex h-full flex-col gap-2'>
          <div>
            <WidgetIcon type='Substack' className='m-0' />
          </div>
          <div>{localHeader}</div>
          <div className='relative flex-grow'>
            {showControls && (
              <ModifyImageWidget
                hasImage={content.image ? true : false}
                restoreImage={restoreImage}
                setErrorInvalidImage={setErrorInvalidImage}
                identifier={identifier}
                addImage={addImage}
                removeImage={removeImage}
                className='absolute left-1/2 top-0 z-20 flex -translate-x-1/2 -translate-y-1/2 transform items-center opacity-0 transition-opacity group-hover:opacity-100'
              />
            )}
            <div className='flex h-full flex-grow overflow-hidden'>
              <BannerImage src={content.image} />
            </div>
          </div>
        </div>
      );
      break;
    case 'C':
      widgetLayout = (
        <div className='flex h-full flex-row gap-2'>
          <div className='w-2/5'>
            <WidgetIcon type='Substack' />
            {localHeader}
          </div>
          <div className='relative ml-auto w-3/5'>
            {showControls && (
              <ModifyImageWidget
                hasImage={content.image ? true : false}
                restoreImage={restoreImage}
                setErrorInvalidImage={setErrorInvalidImage}
                identifier={identifier}
                addImage={addImage}
                removeImage={removeImage}
                className='absolute left-1/2 top-0 z-20 flex -translate-x-1/2 -translate-y-1/2 transform items-center opacity-0 transition-opacity group-hover:opacity-100'
              />
            )}
            <BannerImage src={content.image} />
          </div>
        </div>
      );
      break;
    case 'D':
      widgetLayout = (
        <div className='flex h-full flex-col gap-2'>
          <WidgetIcon type='Substack' className='m-0' />
          <div>{localHeader}</div>
          <div className='relative flex-grow'>
            {showControls && (
              <ModifyImageWidget
                hasImage={content.image ? true : false}
                restoreImage={restoreImage}
                setErrorInvalidImage={setErrorInvalidImage}
                identifier={identifier}
                addImage={addImage}
                removeImage={removeImage}
                className='absolute left-1/2 top-0 z-20 flex -translate-x-1/2 -translate-y-1/2 transform items-center opacity-0 transition-opacity group-hover:opacity-100'
              />
            )}
            <BannerImage src={content.image} />
          </div>
        </div>
      );
      break;
    default:
      widgetLayout = <div>Unsupported widget size</div>;
  }

  return widgetLayout;
};
