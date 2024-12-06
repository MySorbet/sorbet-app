import { BannerImage } from '@/components/profile/widgets/banner-image';
import { ModifyImageControls } from '@/components/profile/widgets/modify-widget-image';
import { BaseWidgetProps, DribbbleWidgetContentType } from '@/types';

import { WidgetDescription } from './widget-description';
import { WidgetIcon } from './widget-icon';

interface DribbbleWidgetProps extends BaseWidgetProps {
  content: DribbbleWidgetContentType;
}

export const DribbbleWidget: React.FC<DribbbleWidgetProps> = ({
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
  const restoreImage = async () => {
    await handleRestoreImage(
      identifier,
      'Dribbble',
      redirectUrl ?? '',
      content
    ); // Call the mutation with the image URL
  };

  let widgetLayout;

  switch (size) {
    case 'A':
      widgetLayout = (
        <div className='flex h-full flex-col gap-2'>
          <div className='flex flex-row gap-2'>
            <div className='w-16'>
              <WidgetIcon type='Dribbble' />
            </div>
            <div>
              <div className='text-sm font-semibold'>{content.title}</div>
              <div className='text-xs text-gray-500'>
                <WidgetDescription description={content.description} />
              </div>
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
            <WidgetIcon type='Dribbble' className='m-0' />
          </div>
          <div>
            <div className='text-sm font-semibold'>{content.title}</div>
            <div className='text-xs text-gray-500'>{content.description}</div>
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
            <WidgetIcon type='Dribbble' />
            <div className='text-sm font-semibold'>{content.title}</div>
            <div className='text-xs text-gray-500'>{content.description}</div>
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
          <WidgetIcon type='Dribbble' className='m-0' />
          <div>
            <div className='text-sm font-semibold'>{content.title}</div>
            <div className='text-xs text-gray-500'>
              <WidgetDescription description={content.description} />
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
    default:
      widgetLayout = <div>Unsupported widget size</div>;
  }

  return widgetLayout;
};
