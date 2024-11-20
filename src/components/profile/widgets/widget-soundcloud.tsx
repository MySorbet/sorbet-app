import React, { Dispatch, SetStateAction } from 'react';

import { BannerImage } from '@/components/profile/widgets/banner-image';
import { ModifyImageWidget } from '@/components/profile/widgets/modify-widget-image';
import {
  SoundcloudTrackContentType,
  WidgetContentType,
  WidgetSize,
  WidgetType,
} from '@/types';

import { ImageOverlay } from './image-overlay';
import { PlayButton } from './play-button';
import { WidgetIcon } from './widget-icon';

interface SoundcloudWidgetType {
  identifier: string;
  showControls?: boolean;
  setErrorInvalidImage: Dispatch<SetStateAction<boolean>>;
  addImage: (key: string, image: File) => Promise<void>;
  removeImage: (key: string) => Promise<void>;
  content: SoundcloudTrackContentType;
  size: WidgetSize;
  redirectUrl?: string;
  handleRestoreImage: (
    key: string,
    type: WidgetType,
    redirectUrl: string,
    content: WidgetContentType
  ) => Promise<void>;
}

export const SoundcloudWidget: React.FC<SoundcloudWidgetType> = ({
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

  const localHeader = (
    <>
      <div className='text-sm font-semibold'>{content.title}</div>
      <div className='text-xs text-gray-500'>{content.artist}</div>
    </>
  );

  const restoreImage = async () => {
    await handleRestoreImage(
      identifier,
      'SoundcloudSong',
      redirectUrl ?? '',
      content
    ); // Call the mutation with the image URL
  };

  switch (size) {
    case 'A':
      widgetLayout = (
        <div className='flex h-full flex-col gap-2 '>
          <div className='flex justify-between'>
            <WidgetIcon type='SoundcloudSong' className='m-0' />
            <PlayButton />
          </div>
          <div>{localHeader}</div>
          <div className='relative flex-grow'>
            {showControls && (
              <ModifyImageWidget
                hasImage={content.artwork ? true : false}
                restoreImage={restoreImage}
                setErrorInvalidImage={setErrorInvalidImage}
                identifier={identifier}
                addImage={addImage}
                removeImage={removeImage}
                className='absolute left-1/2 top-0 z-20 flex -translate-x-1/2 -translate-y-1/2 transform items-center opacity-0 transition-opacity group-hover:opacity-100'
              />
            )}
            <div className='overflow-hidden'>
              <img
                src={content.artwork}
                alt='Github content'
                className='absolute inset-0 h-full w-full rounded-xl object-cover'
              />
              <ImageOverlay />
            </div>
          </div>
        </div>
      );
      break;
    case 'B':
      widgetLayout = (
        <div className='flex h-full flex-col gap-2'>
          <div className='flex justify-between'>
            <WidgetIcon type='SoundcloudSong' className='m-0' />
            <PlayButton />
          </div>
          <div>{localHeader}</div>
          <div className='relative flex-grow'>
            {showControls && (
              <ModifyImageWidget
                hasImage={content.artwork ? true : false}
                restoreImage={restoreImage}
                setErrorInvalidImage={setErrorInvalidImage}
                identifier={identifier}
                addImage={addImage}
                removeImage={removeImage}
                className='absolute left-1/2 top-0 z-20 flex -translate-x-1/2 -translate-y-1/2 transform items-center opacity-0 transition-opacity group-hover:opacity-100'
              />
            )}
            <div className='flex h-full flex-grow overflow-hidden'>
              <BannerImage src={content.artwork} />
            </div>
          </div>
        </div>
      );
      break;
    case 'C':
      widgetLayout = (
        <div className='flex h-full flex-row gap-2'>
          <div className='h-full w-1/5'>
            <div className='flex h-full flex-col gap-1'>
              <WidgetIcon type='SoundcloudSong' />
              <div>{localHeader}</div>
              <div className='mt-auto'>
                <PlayButton />
              </div>
            </div>
          </div>
          <div className='relative ml-auto w-3/5'>
            {showControls && (
              <ModifyImageWidget
                hasImage={content.artwork ? true : false}
                restoreImage={restoreImage}
                setErrorInvalidImage={setErrorInvalidImage}
                identifier={identifier}
                addImage={addImage}
                removeImage={removeImage}
                className='absolute left-1/2 top-0 z-20 flex -translate-x-1/2 -translate-y-1/2 transform items-center opacity-0 transition-opacity group-hover:opacity-100'
              />
            )}
            <BannerImage src={content.artwork} />
          </div>
        </div>
      );
      break;
    case 'D':
      widgetLayout = (
        <div className='flex h-full flex-col gap-2'>
          <div className='flex justify-between'>
            <WidgetIcon type='SoundcloudSong' className='m-0' />
            <PlayButton />
          </div>
          <div>{localHeader}</div>
          <div className='relative flex-grow'>
            {showControls && (
              <ModifyImageWidget
                hasImage={content.artwork ? true : false}
                restoreImage={restoreImage}
                setErrorInvalidImage={setErrorInvalidImage}
                identifier={identifier}
                addImage={addImage}
                removeImage={removeImage}
                className='absolute left-1/2 top-0 z-20 flex -translate-x-1/2 -translate-y-1/2 transform items-center opacity-0 transition-opacity group-hover:opacity-100'
              />
            )}
            <BannerImage src={content.artwork} />
          </div>
        </div>
      );
      break;
    default:
      widgetLayout = <div>Unsupported widget size</div>;
  }

  return widgetLayout;
};
