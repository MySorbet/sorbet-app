import { Trash2 } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

import { Spinner } from '@/components/common';
import {
  BehanceWidget,
  DribbbleWidget,
  FigmaWidget,
  GithubWidget,
  InstagramWidget,
  LinkedInProfileWidget,
  LinkWidget,
  MediumWidget,
  PhotoWidget,
  ResizeWidget,
  SoundcloudWidget,
  SpotifyAlbumWidget,
  SpotifySongWidget,
  SubstackWidget,
  TwitterWidget,
  YouTubeWidget,
} from '@/components/profile';
import { WidgetErrorFallback } from '@/components/profile/widgets';
import { Button } from '@/components/ui/button';
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
  WidgetSize,
  WidgetType,
  YoutubeWidgetContentType,
} from '@/types';

interface WidgetProps {
  identifier: string;
  type: WidgetType;
  w: number;
  h: number;
  editMode: boolean;
  content?: any;
  loading?: boolean;
  initialSize?: WidgetSize;
  redirectUrl?: string;
  handleResize: (key: string, w: number, h: number, size: WidgetSize) => void;
  handleRemove: (key: string) => void;
}

export const Widget: React.FC<WidgetProps> = ({
  identifier,
  type,
  editMode,
  loading,
  content,
  redirectUrl,
  initialSize = 'A',
  handleResize,
  handleRemove,
}) => {
  const [showResizeWidget, setShowResizeWidget] = useState(false);
  const [widgetSize, setWidgetSize] = useState<WidgetSize>(initialSize);
  const [widgetContent, setWidgetContent] = useState<React.ReactNode>(
    <>None</>
  );

  const onWidgetResize = (w: number, h: number, widgetSize: WidgetSize) => {
    handleResize(identifier, w, h, widgetSize);
    setWidgetSize(widgetSize);
  };

  const onWidgetClick = (event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (!editMode && redirectUrl) {
      window.open(redirectUrl, '_blank');
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
            content={content as PhotoWidgetContentType}
            size={widgetSize}
          />
        );
        break;

      case 'Link':
        setWidgetContent(
          <LinkWidget
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
    <ErrorBoundary
      FallbackComponent={WidgetErrorFallback}
      onReset={(details) => {
        // Reset the state of your app so the error doesn't happen again
      }}
    >
      {loading && (
        <div className='align-center absolute z-50 flex h-full w-full items-center justify-center rounded-3xl bg-gray-300 opacity-70 drop-shadow-md'>
          <Spinner />
        </div>
      )}
      <div
        className={cn(
          'transition-height duration-1500 relative z-10 flex h-full w-full cursor-pointer flex-col rounded-3xl bg-white drop-shadow-md ease-in-out',
          type !== 'Photo' && 'p-4'
        )}
        key={identifier}
        onMouseEnter={() => editMode && setShowResizeWidget(true)}
        onMouseLeave={() => editMode && setShowResizeWidget(false)}
        onClick={onWidgetClick}
      >
        {widgetContent}
        <div
          className={`absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-6 transform transition-opacity duration-300 ${
            showResizeWidget ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div className='flex flex-row gap-1'>
            <ResizeWidget onResize={onWidgetResize} initialSize={initialSize} />
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
      </div>
    </ErrorBoundary>
  );
};
