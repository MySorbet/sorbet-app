import { Trash2 } from 'lucide-react';
import { Image03, LinkExternal02 } from '@untitled-ui/icons-react';
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
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
  handleImageCropping: any;
  activeWidget: string | null;
  widgetDimensions: {
    width: number;
    height: number;
  };
  addImage: (key: string, image: File) => Promise<void>;
  setErrorInvalidImage: Dispatch<SetStateAction<boolean>>;
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
  setErrorInvalidImage,
  addImage,
}) => {
  const [widgetSize, setWidgetSize] = useState<WidgetSize>(initialSize);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [widgetContent, setWidgetContent] = useState<React.ReactNode>(
    <>None</>
  );

  /** update image dimensions */
  const onWidgetResize = (w: number, h: number, widgetSize: WidgetSize) => {
    handleResize(identifier, w, h, widgetSize);
    setWidgetSize(widgetSize);
  };

  /** handles the update of widget redirect urls */
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
        setWidgetContent(
          <PhotoWidget
            croppedArea={(content as PhotoWidgetContentType).croppedArea}
            content={content as PhotoWidgetContentType}
            size={widgetSize}
          />
        );
        break;

      case 'Link':
        setWidgetContent(
          <LinkWidget
            setErrorInvalidImage={setErrorInvalidImage}
            identifier={identifier}
            addImage={addImage}
            showControls={showControls}
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
        id={identifier}
        key={identifier}
        onClick={!showControls ? onWidgetClick : () => {}} // Don't redirect if editing dashboard, similar to Bento
      >
        {loading ? (
          <Skeleton
            className={cn(
              'size-full rounded-xl',
              type === 'Photo' && 'rounded-3xl'
            )}
          />
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
