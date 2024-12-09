import { BannerImage } from '@/components/profile/widgets/banner-image';
import { ModifyImageControls } from '@/components/profile/widgets/modify-image-controls';
import { BaseWidgetProps, MediumArticleContentType } from '@/types';

import { ImageOverlay } from './image-overlay';
import { WidgetIcon } from './widget-icon';

interface MediumWidgetProps extends BaseWidgetProps {
  content: MediumArticleContentType;
}

export const MediumWidget: React.FC<MediumWidgetProps> = ({
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
    await handleRestoreImage(identifier, 'Medium', redirectUrl ?? '', content); // Call the mutation with the image URL
  };

  switch (size) {
    case 'A':
      widgetLayout = (
        <div className='flex h-full flex-col gap-2'>
          <div className='flex flex-row gap-2'>
            <div className='w-1/4'>
              <WidgetIcon type='Medium' />
            </div>
            <div>
              <div className='text-sm font-semibold'>{content.title}</div>
              <div className='text-xs text-gray-500'>{content.host}</div>
            </div>
          </div>
          <div className='relative flex-grow'>
            {showControls && (
              <ModifyImageControls
                hasImage={!!content.image}
                restoreImage={restoreImage}
                setErrorInvalidImage={setErrorInvalidImage}
                identifier={identifier}
                addImage={addImage}
                removeImage={removeImage}
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
            <WidgetIcon type='Medium' className='m-0' />
          </div>
          <div>
            <div className='text-sm font-semibold'>{content.title}</div>
            <div className='text-xs text-gray-500'>{content.host}</div>
          </div>
          <div className='relative flex-grow'>
            {showControls && (
              <ModifyImageControls
                hasImage={!!content.image}
                restoreImage={restoreImage}
                setErrorInvalidImage={setErrorInvalidImage}
                identifier={identifier}
                addImage={addImage}
                removeImage={removeImage}
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
            <WidgetIcon type='Medium' />
            <WidgetIcon type='Medium' />
            <div className='text-sm font-semibold'>{content.title}</div>
            <div className='text-xs text-gray-500'>{content.host}</div>
          </div>
          <div className='relative ml-auto w-3/5'>
            {showControls && (
              <ModifyImageControls
                hasImage={!!content.image}
                restoreImage={restoreImage}
                setErrorInvalidImage={setErrorInvalidImage}
                identifier={identifier}
                addImage={addImage}
                removeImage={removeImage}
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
          <WidgetIcon type='Medium' className='m-0' />
          <div>
            <div className='text-sm font-semibold'>{content.title}</div>
            <div className='text-xs text-gray-500'>{content.host}</div>
          </div>
          <div className='relative h-full w-full overflow-hidden rounded-xl'>
            <img
              src={content.image}
              alt='Medium content'
              className='h-full w-full object-cover'
              style={{ objectFit: 'cover' }}
            />
            <ImageOverlay />
          </div>
        </div>
      );
      break;
    default:
      widgetLayout = <div>Unsupported widget size</div>;
  }

  return widgetLayout;
};
