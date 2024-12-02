import { Trash2 } from 'lucide-react';
import posthog from 'posthog-js';
import React, { useEffect, useState } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

import { SectionTitleWidget } from '@/components/profile/widgets/widget-section';
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
  SectionTitleWidgetContentType,
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
  sorbetUserId: string;
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
  handleTitleUpdate: any;
}

export const Widget: React.FC<WidgetProps> = ({
  sorbetUserId,
  identifier,
  type,
  loading,
  content,
  redirectUrl,
  initialSize = 'A',
  showControls = false,
  handleResize,
  handleRemove,
  handleTitleUpdate,
  draggedRef,
}) => {
  const [widgetSize, setWidgetSize] = useState<WidgetSize>(initialSize);
  const [widgetContent, setWidgetContent] = useState<React.ReactNode>(
    <>None</>
  );

  const onWidgetResize = (w: number, h: number, widgetSize: WidgetSize) => {
    handleResize(identifier, w, h, widgetSize);
    setWidgetSize(widgetSize);
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
    posthog.capture('widget_clicked', {
      widget_name: type,
      widget_identifier: identifier,
      widget_url: redirectUrl,
      user_id: sorbetUserId,
    });
    // TODO: Maybe widgets should be anchors?
  };

  const updateTitle = (title: string) => {
    handleTitleUpdate(identifier, title);
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

      case 'SectionTitle':
        setWidgetContent(
          <SectionTitleWidget
            title={(content as SectionTitleWidgetContentType).title}
            updateTitle={updateTitle}
          />
        );
        break;

      default:
        setWidgetContent(<>Unsupported widget type</>);
        break;
    }
    // disabling here because 'redirectUrl' and 'updateTitle' being dependencies will cause massive re-renders
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type, widgetSize, content]);

  return (
    <ErrorBoundary FallbackComponent={WidgetErrorFallback}>
      <div
        className={cn(
          'group relative z-10 flex size-full cursor-pointer flex-col rounded-3xl drop-shadow-md',
          type !== 'Photo' && type !== 'SectionTitle' && 'p-4',
          type !== 'SectionTitle' && 'bg-white',
          type === 'SectionTitle' && 'py-4'
        )}
        key={identifier}
        onClick={onWidgetClick}
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
        {showControls && (
          <div
            className={cn(
              'absolute bottom-0 left-1/2 -translate-x-1/2 transform opacity-0 transition-opacity duration-300 group-hover:opacity-100',
              type !== 'SectionTitle' && 'translate-y-5',
              type === 'SectionTitle' && '-translate-y-1' // to account for margins on the background of section titles
            )}
          >
            <div className='flex flex-row gap-1'>
              {type !== 'SectionTitle' && (
                <ResizeWidget
                  onResize={onWidgetResize}
                  initialSize={initialSize}
                />
              )}
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
