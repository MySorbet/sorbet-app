import { Trash2 } from 'lucide-react';
import { Image03, LinkExternal02 } from '@untitled-ui/icons-react';
import React, { useEffect, useState } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import {
  BehanceWidgetContentType,
  DribbbleWidgetContentType,
  FigmaWidgetContentType,
  GithubWidgetContentType,
  InstagramWidgetContentType,
  LinkedInProfileWidgetContentType,
  LinkWidgetContentType,
  MediumArticleContentType,
  PhotoWidgetContentType,
  SoundcloudTrackContentType,
  SpotifyWidgetContentType,
  SubstackWidgetContentType,
  TwitterWidgetContentType,
  WidgetContentType,
  WidgetDimensions,
  WidgetSize,
  WidgetType,
  YoutubeWidgetContentType,
} from '@/types';

import { ResizeWidget } from './resize-widget';
import { BehanceWidget } from './widget-behance';
import { DribbbleWidget } from './widget-dribbble';
import { WidgetErrorFallback } from './widget-error-fallback';
import { FigmaWidget } from './widget-figma';
import { GithubWidget } from './widget-github';
import { InstagramWidget } from './widget-instagram';
import { LinkWidget } from './widget-link';
import { LinkedInProfileWidget } from './widget-linkedin-profile';
import { MediumWidget } from './widget-medium';
import { PhotoWidget } from './widget-photo';
import { SoundcloudWidget } from './widget-soundcloud';
import { SpotifyAlbumWidget } from './widget-spotify-album';
import { SpotifySongWidget } from './widget-spotify-song';
import { SubstackWidget } from './widget-substack';
import { TwitterWidget } from './widget-twitter';
import { YouTubeWidget } from './widget-youtube';
import Cropper, { Area } from 'react-easy-crop';
import { ImageOverlay } from '@/components/profile/widgets/image-overlay';
import { ModifyImageWidget } from '@/components/profile/widgets/modify-widget-image';

interface WidgetProps {
  identifier: string;
  type: WidgetType;
  w: number;
  h: number;
  content?: WidgetContentType;
  loading?: boolean;
  initialSize?: WidgetSize;
  redirectUrl?: string;
  draggedRef: React.MutableRefObject<boolean>;
  showControls?: boolean;
  handleResize: (key: string, w: number, h: number, size: WidgetSize) => void;
  handleRemove: (key: string) => void;
  handleEditLink: (key: string, url: string) => void;
  setActiveWidget: (widgetId: string | null) => void;
  activeWidget: string | null;
  widgetDimensions: {
    width: number;
    height: number;
  };
  addUrl: any;
}

export const Widget: React.FC<WidgetProps> = ({
  identifier,
  type,
  loading,
  content,
  redirectUrl,
  initialSize = 'A',
  showControls = false,
  handleResize,
  handleRemove,
  handleEditLink,
  draggedRef,
  setActiveWidget,
  activeWidget,
  widgetDimensions,
  addUrl,
}) => {
  const [widgetSize, setWidgetSize] = useState<WidgetSize>(initialSize);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [widgetContent, setWidgetContent] = useState<React.ReactNode>(
    <>None</>
  );

  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);

  /** update image dimensions */
  const onCropComplete = (croppedArea: Area, croppedAreaPixels: Area) => {
    console.log(zoom, croppedArea, croppedAreaPixels);
  };

  const onWidgetResize = (w: number, h: number, widgetSize: WidgetSize) => {
    handleResize(identifier, w, h, widgetSize);
    setWidgetSize(widgetSize);
  };

  const onWidgetLinkEdit = (url: string) => {
    handleEditLink(identifier, url);
  };

  const onWidgetClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const dragged = draggedRef.current;
    draggedRef.current = false;
    if (!dragged) {
      if (redirectUrl) {
        const newWindow = window.open(redirectUrl, '_blank');
        if (newWindow) {
          newWindow.opener = null;
        }
      }
    }
    // TODO: Maybe widgets should be anchors?
  };

  const calculateScaleFactor = (content: PhotoWidgetContentType) => {
    const containerRatio = widgetDimensions.width / widgetDimensions.height;
    const img = new Image();
    img.src = (content as PhotoWidgetContentType).image;

    const imageRatio = img.width / img.height;
    console.log(
      widgetDimensions.width,
      img.width,
      widgetDimensions.height,
      img.height
    );

    console.log(imageRatio, containerRatio);

    let scaleFactor = 1;
    let offsets = { x: 0, y: 0 };
    let widthRatio = 0;
    let heightRatio = 0;

    if (img.height < widgetDimensions.height) {
      heightRatio = widgetDimensions.height / img.height;
    } else {
      heightRatio = img.height / widgetDimensions.height;
    }

    if (img.width < widgetDimensions.width) {
      widthRatio = widgetDimensions.width / img.width;
    } else {
      widthRatio = img.width / widgetDimensions.width;
    }

    if (imageRatio < containerRatio) {
      // Image is wider than container
      offsets = { x: (img.width - img.height) / 2, y: 0 };
    } else {
      // Image is taller than container
      offsets = { x: 0, y: (img.height - img.width) / 2 };
    }

    console.log(
      widthRatio,
      heightRatio,
      img.width,
      img.height,
      widgetDimensions.width,
      widgetDimensions.height
    );

    /** for handling lop-sided images */
    setZoom(
      Math.abs(widthRatio - heightRatio) < 0.1
        ? Math.max(widthRatio, heightRatio)
        : widthRatio * heightRatio
    );
    setCrop(offsets);
  };

  useEffect(() => {
    switch (type) {
      case 'Dribbble':
        setWidgetContent(
          <DribbbleWidget
            content={content as DribbbleWidgetContentType}
            size={widgetSize}
          />
        );
        break;
      case 'Behance':
        setWidgetContent(
          <BehanceWidget
            content={content as BehanceWidgetContentType}
            size={widgetSize}
          />
        );
        break;
      case 'Medium':
        setWidgetContent(
          <MediumWidget
            content={content as MediumArticleContentType}
            size={widgetSize}
          />
        );
        break;
      case 'Youtube':
        setWidgetContent(
          <YouTubeWidget
            content={content as YoutubeWidgetContentType}
            size={widgetSize}
          />
        );
        break;

      case 'Substack':
        setWidgetContent(
          <SubstackWidget
            content={content as SubstackWidgetContentType}
            size={widgetSize}
          />
        );
        break;

      case 'SpotifyAlbum':
        setWidgetContent(
          <SpotifyAlbumWidget
            content={content as SpotifyWidgetContentType}
            size={widgetSize}
          />
        );
        break;

      case 'SpotifySong':
        setWidgetContent(
          <SpotifySongWidget
            content={content as SpotifyWidgetContentType}
            size={widgetSize}
          />
        );
        break;

      case 'SoundcloudSong':
        setWidgetContent(
          <SoundcloudWidget
            content={content as SoundcloudTrackContentType}
            size={widgetSize}
          />
        );
        break;

      case 'InstagramProfile':
        setWidgetContent(
          <InstagramWidget
            content={content as InstagramWidgetContentType}
            size={widgetSize}
          />
        );
        break;

      case 'Github':
        setWidgetContent(
          <GithubWidget
            addUrl={addUrl}
            content={content as GithubWidgetContentType}
            size={widgetSize}
          />
        );
        break;

      case 'Figma':
        setWidgetContent(
          <FigmaWidget
            content={content as FigmaWidgetContentType}
            size={widgetSize}
          />
        );
        break;

      case 'TwitterProfile':
        setWidgetContent(
          <TwitterWidget
            content={content as TwitterWidgetContentType}
            size={widgetSize}
          />
        );
        break;

      case 'Photo':
        console.log(calculateScaleFactor(content as PhotoWidgetContentType));
        calculateScaleFactor(content as PhotoWidgetContentType);

        setWidgetContent(
          <PhotoWidget
            offsets={{ x: 0, y: 0 }}
            zoom={1}
            content={content as PhotoWidgetContentType}
            size={widgetSize}
          />
        );
        break;

      case 'Link':
        setWidgetContent(
          <LinkWidget
            identifier={identifier}
            addUrl={addUrl}
            content={content as LinkWidgetContentType}
            size={widgetSize}
          />
        );
        break;

      case 'LinkedInProfile': {
        // For now, just say the name is their handle
        // TODO: Remove this once real linked in data is available
        let handle;
        try {
          const segments = new URL(redirectUrl ?? '').pathname.split('/');
          handle = segments.pop() || segments.pop(); // Handle potential trailing slash
        } catch (e) {
          console.error('Failed to get LinkedIn handle from URL: ', e);
        }

        setWidgetContent(
          <LinkedInProfileWidget
            content={
              {
                ...content,
                name: handle,
              } as LinkedInProfileWidgetContentType
            }
            size={widgetSize}
          />
        );
        break;
      }

      default:
        setWidgetContent(<>Unsupported widget type</>);
        break;
    }
  }, [type, widgetSize, content]);

  return (
    <ErrorBoundary FallbackComponent={WidgetErrorFallback}>
      <div
        className={cn(
          'group relative z-10 flex size-full cursor-pointer flex-col rounded-3xl bg-white drop-shadow-md',
          type !== 'Photo' && 'p-4'
        )}
        key={identifier}
        /** onClick={!isCropping ? onWidgetClick : () => {}} */
      >
        {loading ? (
          <Skeleton
            className={cn(
              'size-full rounded-xl',
              type === 'Photo' && 'rounded-3xl'
            )}
          />
        ) : type === 'Photo' &&
          /** activeWidget || */ activeWidget === identifier ? (
          <div className='relative h-full overflow-hidden rounded-3xl'>
            <Cropper
              image={(content as PhotoWidgetContentType)?.image}
              crop={crop}
              zoom={zoom}
              aspect={3 / 3}
              cropSize={{
                width: widgetDimensions.width,
                height: widgetDimensions.height,
              }}
              onCropChange={setCrop}
              onCropComplete={onCropComplete}
              onZoomChange={setZoom}
              // objectFit={getImageRatio(content as PhotoWidgetContentType)}
              maxZoom={10}
            />
          </div>
        ) : (
          widgetContent
        )}
        {(showControls || activeWidget) && (
          <div
            className={`absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-5 transform ${
              isPopoverOpen
                ? ''
                : 'opacity-0 transition-opacity duration-300 group-hover:opacity-100'
            }`}
          >
            <div className='flex flex-row gap-1'>
              <ResizeWidget
                redirectUrl={redirectUrl}
                onResize={onWidgetResize}
                onEditLink={onWidgetLinkEdit}
                setPopoverOpen={setIsPopoverOpen}
                popoverOpen={isPopoverOpen}
                initialSize={initialSize}
                identifier={identifier}
                activeWidget={activeWidget}
                setActiveWidget={setActiveWidget}
              />
              <Button
                variant='outline'
                size='icon'
                className='rounded-full border-gray-800 bg-gray-800 text-white hover:bg-gray-800 hover:text-white'
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemove(identifier);
                }}
              >
                <Trash2 size={18} />
              </Button>
            </div>
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
};
