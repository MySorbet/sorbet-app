import { Spinner } from '@/components/common';
import {
  BehanceWidget,
  DefaultWidget,
  DribbbleWidget,
  FigmaWidget,
  GithubWidget,
  InstagramWidget,
  MediumWidget,
  ResizeWidget,
  SoundcloudWidget,
  SpotifyAlbumWidget,
  SpotifySongWidget,
  SubstackWidget,
  TwitterWidget,
  YouTubeWidget,
  PhotoWidget,
} from '@/components/profile';
import { WidgetErrorFallback } from '@/components/profile/widgets/widget-error-fallback';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  BehanceWidgetContentType,
  DribbbleWidgetContentType,
  FigmaWidgetContentType,
  GithubWidgetContentType,
  InstagramWidgetContentType,
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
import { Trash2 } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

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
  initialSize = WidgetSize.A,
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
      case WidgetType.Dribbble:
        setWidgetContent(
          <DribbbleWidget
            content={content as DribbbleWidgetContentType}
            size={widgetSize}
          />
        );
        break;
      case WidgetType.Behance:
        setWidgetContent(
          <BehanceWidget
            content={content as BehanceWidgetContentType}
            size={widgetSize}
          />
        );
        break;
      case WidgetType.Medium:
        setWidgetContent(
          <MediumWidget
            content={content as MediumArticleContentType}
            size={widgetSize}
          />
        );
        break;
      case WidgetType.Youtube:
        setWidgetContent(
          <YouTubeWidget
            content={content as YoutubeWidgetContentType}
            size={widgetSize}
          />
        );
        break;

      case WidgetType.Substack:
        setWidgetContent(
          <SubstackWidget
            content={content as SubstackWidgetContentType}
            size={widgetSize}
          />
        );
        break;

      case WidgetType.SpotifyAlbum:
        setWidgetContent(
          <SpotifyAlbumWidget
            content={content as SpotifyWidgetContentType}
            size={widgetSize}
          />
        );
        break;

      case WidgetType.SpotifySong:
        setWidgetContent(
          <SpotifySongWidget
            content={content as SpotifyWidgetContentType}
            size={widgetSize}
          />
        );
        break;

      case WidgetType.SoundcloudSong:
        setWidgetContent(
          <SoundcloudWidget
            content={content as SoundcloudTrackContentType}
            size={widgetSize}
          />
        );
        break;

      case WidgetType.InstagramProfile:
        setWidgetContent(
          <InstagramWidget
            content={content as InstagramWidgetContentType}
            size={widgetSize}
          />
        );
        break;

      case WidgetType.Github:
        setWidgetContent(
          <GithubWidget
            content={content as GithubWidgetContentType}
            size={widgetSize}
          />
        );
        break;

      case WidgetType.Figma:
        setWidgetContent(
          <FigmaWidget
            content={content as FigmaWidgetContentType}
            size={widgetSize}
          />
        );
        break;

      case WidgetType.Twitter:
        setWidgetContent(
          <TwitterWidget
            content={content as TwitterWidgetContentType}
            size={widgetSize}
          />
        );
        break;

      case WidgetType.Photo:
        setWidgetContent(
          <PhotoWidget
            content={content as PhotoWidgetContentType}
            size={widgetSize}
          />
        );
        break;

      case WidgetType.Default:
        setWidgetContent(<DefaultWidget />);
        break;

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
        <div className='flex justify-center align-center items-center bg-gray-300 opacity-70 h-full w-full absolute z-50 rounded-xl'>
          <Spinner />
        </div>
      )}
      <div
        className={cn(
          'shadow-widget bg-white flex flex-col rounded-xl w-full h-full relative cursor-pointer z-10 transition-height duration-1500 ease-in-out',
          type === WidgetType.Photo ? '' : 'p-3'
        )}
        key={identifier}
        onMouseEnter={() => editMode && setShowResizeWidget(true)}
        onMouseLeave={() => editMode && setShowResizeWidget(false)}
        onClick={onWidgetClick}
      >
        {widgetContent}
        <div
          className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-6 transition-opacity duration-300 ${
            showResizeWidget ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div className='flex flex-row gap-1'>
            <ResizeWidget onResize={onWidgetResize} initialSize={initialSize} />
            <Button
              variant='outline'
              size='icon'
              className='rounded-full bg-gray-800 text-white border-gray-800 hover:bg-gray-800 hover:text-white'
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
