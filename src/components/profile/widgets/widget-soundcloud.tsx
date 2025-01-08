import React from 'react';

import { BannerImage } from '@/components/profile/widgets/banner-image';
import { ModifyImageControls } from '@/components/profile/widgets/modify-image-controls';
import { BaseWidgetProps, SoundcloudTrackContentType } from '@/types';

import { PlayButton } from './play-button';
import { WidgetIcon } from './widget-icon';

interface SoundcloudWidgetProps extends BaseWidgetProps {
  content: SoundcloudTrackContentType;
}

export const SoundcloudWidget: React.FC<SoundcloudWidgetProps> = ({
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
    await handleRestoreImage(identifier, 'SoundcloudSong', redirectUrl ?? ''); // Call the mutation with the image URL
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
              <ModifyImageControls
                hasImage={content.artwork ? true : false}
                restoreImage={restoreImage}
                setErrorInvalidImage={setErrorInvalidImage}
                identifier={identifier}
                addImage={addImage}
                removeImage={removeImage}
              />
            )}
            <BannerImage src={content.artwork} />
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
              <ModifyImageControls
                hasImage={content.artwork ? true : false}
                restoreImage={restoreImage}
                setErrorInvalidImage={setErrorInvalidImage}
                identifier={identifier}
                addImage={addImage}
                removeImage={removeImage}
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
              <ModifyImageControls
                hasImage={content.artwork ? true : false}
                restoreImage={restoreImage}
                setErrorInvalidImage={setErrorInvalidImage}
                identifier={identifier}
                addImage={addImage}
                removeImage={removeImage}
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
              <ModifyImageControls
                hasImage={content.artwork ? true : false}
                restoreImage={restoreImage}
                setErrorInvalidImage={setErrorInvalidImage}
                identifier={identifier}
                addImage={addImage}
                removeImage={removeImage}
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
