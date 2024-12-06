import { Trash2 } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

import { SectionTitleWidget } from '@/components/profile/widgets/widget-section';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import {
  BaseWidgetProps,
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

interface WidgetProps extends BaseWidgetProps {
  type: WidgetType;
  w: number;
  h: number;
  content?: WidgetContentType;
  loading?: boolean;
  draggedRef: React.MutableRefObject<boolean>;
  activeWidget: string | null;
  widgetDimensions: {
    width: number;
    height: number;
  };
  handleResize: (key: string, w: number, h: number, size: WidgetSize) => void;
  handleRemove: (key: string) => void;
  handleEditLink: (key: string, url: string) => void;
  setActiveWidget: (widgetId: string | null) => void;
  handleTitleUpdate: (key: string, title: string) => Promise<void>;
}

export const Widget: React.FC<WidgetProps> = ({
  identifier,
  type,
  loading,
  content,
  redirectUrl,
  size = 'A',
  showControls = false,
  handleResize,
  handleRemove,
  handleEditLink,
  handleRestoreImage,
  handleTitleUpdate,
  draggedRef,
  setActiveWidget,
  activeWidget,
  setErrorInvalidImage,
  addImage,
  removeImage,
}) => {
  const [widgetSize, setWidgetSize] = useState<WidgetSize>(size);
  const [isisAddLinkOpen, setIsisAddLinkOpen] = useState(false);
  const [widgetContent, setWidgetContent] = useState<React.ReactNode>(
    <>None</>
  );
  const [photoDimensions, setPhotoDimensions] = useState<{
    w: number;
    h: number;
  }>();

  /** update image dimensions */
  const onWidgetResize = (w: number, h: number, widgetSize: WidgetSize) => {
    handleResize(identifier, w, h, widgetSize);
    setWidgetSize(widgetSize);
  };

  /** handles the update of widget redirect urls */
  const onWidgetLinkEdit = (url: string) => {
    handleEditLink(identifier, url);
  };

  const onWidgetClick = () => {
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

  const updateTitle = (title: string) => {
    handleTitleUpdate(identifier, title);
  };

  /** For setting the content of the widgets dynamically
   * List of components that support image replacement
   * - GitHub
   * - Twitter
   * - Soundcloud
   * - Medium
   * - Dribble
   * - Behance
   * - Substack
   * - Youtube
   * - LinkedIn
   *
   * List of components that don't support image replacement:
   * - Instagram Profiles (too many pictures)
   * - Figma (not implemented)
   * - Spotify Song/Album (Bento doesn't allow it + iframes)
   */
  useEffect(() => {
    switch (type) {
      case 'Dribbble':
        setWidgetContent(
          <DribbbleWidget
            setErrorInvalidImage={setErrorInvalidImage}
            identifier={identifier}
            addImage={addImage}
            removeImage={removeImage}
            showControls={showControls}
            content={content as DribbbleWidgetContentType}
            size={widgetSize}
            redirectUrl={redirectUrl}
            handleRestoreImage={handleRestoreImage}
          />
        );
        break;
      case 'Behance':
        setWidgetContent(
          <BehanceWidget
            setErrorInvalidImage={setErrorInvalidImage}
            identifier={identifier}
            addImage={addImage}
            removeImage={removeImage}
            showControls={showControls}
            content={content as BehanceWidgetContentType}
            size={widgetSize}
            redirectUrl={redirectUrl}
            handleRestoreImage={handleRestoreImage}
          />
        );
        break;
      case 'Medium':
        setWidgetContent(
          <MediumWidget
            setErrorInvalidImage={setErrorInvalidImage}
            identifier={identifier}
            addImage={addImage}
            removeImage={removeImage}
            showControls={showControls}
            content={content as MediumArticleContentType}
            size={widgetSize}
            redirectUrl={redirectUrl}
            handleRestoreImage={handleRestoreImage}
          />
        );
        break;
      case 'Youtube':
        setWidgetContent(
          <YouTubeWidget
            setErrorInvalidImage={setErrorInvalidImage}
            identifier={identifier}
            addImage={addImage}
            removeImage={removeImage}
            showControls={showControls}
            content={content as YoutubeWidgetContentType}
            size={widgetSize}
            redirectUrl={redirectUrl}
            handleRestoreImage={handleRestoreImage}
          />
        );
        break;

      case 'Substack':
        setWidgetContent(
          <SubstackWidget
            setErrorInvalidImage={setErrorInvalidImage}
            identifier={identifier}
            addImage={addImage}
            removeImage={removeImage}
            showControls={showControls}
            content={content as SubstackWidgetContentType}
            size={widgetSize}
            redirectUrl={redirectUrl}
            handleRestoreImage={handleRestoreImage}
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
            setErrorInvalidImage={setErrorInvalidImage}
            identifier={identifier}
            addImage={addImage}
            removeImage={removeImage}
            showControls={showControls}
            content={content as SoundcloudTrackContentType}
            size={widgetSize}
            redirectUrl={redirectUrl}
            handleRestoreImage={handleRestoreImage}
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
            setErrorInvalidImage={setErrorInvalidImage}
            identifier={identifier}
            addImage={addImage}
            removeImage={removeImage}
            showControls={showControls}
            content={content as GithubWidgetContentType}
            size={widgetSize}
            redirectUrl={redirectUrl}
            handleRestoreImage={handleRestoreImage}
          />
        );
        break;

      /** not supported yet */
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
            setErrorInvalidImage={setErrorInvalidImage}
            identifier={identifier}
            addImage={addImage}
            removeImage={removeImage}
            showControls={showControls}
            content={content as TwitterWidgetContentType}
            size={widgetSize}
            redirectUrl={redirectUrl}
            handleRestoreImage={handleRestoreImage}
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
            setErrorInvalidImage={setErrorInvalidImage}
            identifier={identifier}
            addImage={addImage}
            removeImage={removeImage}
            showControls={showControls}
            content={content as LinkWidgetContentType}
            size={widgetSize}
            redirectUrl={redirectUrl}
            handleRestoreImage={handleRestoreImage}
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
            setErrorInvalidImage={setErrorInvalidImage}
            identifier={identifier}
            addImage={addImage}
            removeImage={removeImage}
            showControls={showControls}
            content={
              {
                ...content,
                name: handle,
              } as LinkedInProfileWidgetContentType
            }
            size={widgetSize}
            redirectUrl={redirectUrl}
            handleRestoreImage={handleRestoreImage}
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
  }, [
    type,
    widgetSize,
    content,
    addImage,
    identifier,
    redirectUrl,
    removeImage,
    setErrorInvalidImage,
    showControls,
    handleRestoreImage,
  ]);

  /** For photo widgets to disable cropping for square images */
  useEffect(() => {
    if (type === 'Photo') {
      const img = new Image();
      img.src = (content as PhotoWidgetContentType).image; // Set the image source URL

      // Once the image is loaded, update the state with its dimensions
      img.onload = () => {
        setPhotoDimensions({ w: img.width, h: img.height });
      };
    }
  }, [type, content]);

  return (
    <ErrorBoundary FallbackComponent={WidgetErrorFallback}>
      <div
        className={cn(
          'group relative z-10 flex size-full cursor-pointer flex-col rounded-3xl drop-shadow-md',
          type !== 'Photo' && type !== 'SectionTitle' && 'p-4',
          type !== 'SectionTitle' && 'bg-white',
          type === 'SectionTitle' && 'py-4'
        )}
        id={identifier}
        key={identifier}
        onClick={!showControls ? onWidgetClick : undefined} // Don't redirect if editing dashboard, similar to Bento
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
            className={cn(
              `absolute bottom-0 left-1/2 -translate-x-1/2 ${
                isisAddLinkOpen
                  ? ''
                  : 'transform opacity-0 transition-opacity duration-300 group-hover:opacity-100'
              }`,
              type !== 'SectionTitle' && 'translate-y-5',
              type === 'SectionTitle' && '-translate-y-1' // to account for margins on the background of section titles}
            )}
          >
            <div className='flex flex-row gap-1'>
              {type !== 'SectionTitle' && (
                <ResizeWidget
                  redirectUrl={redirectUrl}
                  onResize={onWidgetResize}
                  onEditLink={onWidgetLinkEdit}
                  setIsAddLinkOpen={setIsisAddLinkOpen}
                  isAddLinkOpen={isisAddLinkOpen}
                  initialSize={size}
                  identifier={identifier}
                  activeWidget={activeWidget}
                  setActiveWidget={setActiveWidget}
                  type={type}
                  photoDimensions={
                    photoDimensions ? photoDimensions : undefined
                  }
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
