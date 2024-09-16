import { HelpCircle, Link03 } from '@untitled-ui/icons-react';
import { ImagePlus } from 'lucide-react';
import React, { useState } from 'react';

import { Spinner } from '@/components/common';
import { InvalidAlert } from '@/components/profile';
import {
  parseWidgetTypeFromUrl,
  validateUrl,
} from '@/components/profile/widgets';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

interface AddWidgetsProps {
  addUrl: (url: string, image?: File | undefined) => void;
  loading?: boolean;
}

/**
 * Renders a fancy input to add links and images as widgets
 */
export const AddWidgets: React.FC<AddWidgetsProps> = ({
  addUrl,
  loading = false,
}) => {
  const [url, setUrl] = useState<string>('');
  const [error, setError] = useState<string>();
  const [errorInvalidImage, showErrorInvalidImage] = useState<boolean>(false);

  const [disabled, setDisabled] = useState<boolean>(true);

  // TODO: This still needs work
  const handleUrlSubmit = () => {
    if (loading) return;

    if (!validateUrl(url)) {
      setError('invalid');
      return;
    }

    // Calling this here so that it throws an error to display
    try {
      parseWidgetTypeFromUrl(url);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('Unexpected error');
      }
      return;
    }

    // If the above doesn't throw, we're good to add the url
    addUrl(url);
  };

  const handleUrlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!loading) {
      const currentUrl = event.target.value;
      setUrl(currentUrl);

      if (error && currentUrl === '') {
        setError(undefined);
      }

      setDisabled(currentUrl === '' || !validateUrl(currentUrl));
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : undefined;
    if (file) {
      const validExtensions = ['jpg', 'jpeg', 'png', 'gif'];
      const fileSize = file.size / 1024 / 1024; // in MB
      const fileExtension = file.name.split('.').pop()?.toLowerCase();

      if (!fileExtension) {
        // This condition is hit if there is no file extension
        showErrorInvalidImage(true);
        return;
      }

      if (validExtensions.includes(fileExtension) && fileSize <= 10) {
        addUrl('https://storage.googleapis.com', file);
      } else {
        showErrorInvalidImage(true);
      }
    }
  };

  const panelClass = loading ? 'opacity-90 pointer-events-none' : '';

  return (
    <div className={`isolate hidden max-w-96 md:block ${panelClass}`}>
      {error && (
        <div className='animate-in slide-in-from-bottom-8 z-0 mb-2'>
          <InvalidAlert
            handleAlertVisible={(status: boolean) => {
              if (!status) {
                setError(undefined);
                setUrl('');
              }
            }}
            title='Link not supported'
          >
            {/* Default error */}
            {error === 'invalid' ? (
              <>
                <p className='mt-2'>We only support the following links:</p>
                <p className='font-semibold'>
                  Dribble, Behance, Spotify, Instagram, Soundcloud, Youtube,
                  Medium, Substack, Twitter, GitHub
                </p>
              </>
            ) : (
              <p>{error}</p>
            )}
          </InvalidAlert>
        </div>
      )}

      {errorInvalidImage && (
        <div className='animate-in slide-in-from-bottom-8 z-0 mb-2'>
          <InvalidAlert
            handleAlertVisible={(show: boolean) => showErrorInvalidImage(show)}
            title='Error uploading file'
          >
            <p className='mt-2'>
              You can only upload jpg, png or gif files only.
            </p>
            <p>Maximum 10mb file size</p>
          </InvalidAlert>
        </div>
      )}
      <div
        className={`z-10 flex w-full flex-row gap-4 rounded-2xl bg-white px-4 py-3 drop-shadow-xl ${panelClass}`}
      >
        <div
          className={cn(
            'flex flex-grow items-center rounded-lg border-2 px-3 py-2',
            error ? 'border-red-500' : 'border-gray-300'
          )}
        >
          <Link03 className='text-muted-foreground mr-2 size-5' />

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleUrlSubmit();
            }}
            className='flex w-full flex-grow items-center justify-between'
          >
            <input
              type='text'
              className='flex-1 outline-none'
              placeholder='paste link'
              onChange={handleUrlChange}
              value={url}
              disabled={loading}
            />
            <Button
              type='submit'
              className='bg-sorbet h-fit px-3 py-1'
              disabled={loading || disabled}
            >
              {loading ? <Spinner size='small' /> : <span>Add</span>}
            </Button>
          </form>
          <Popover>
            <PopoverTrigger>
              <HelpCircle className='ml-2 size-4 cursor-pointer' />
            </PopoverTrigger>
            <PopoverContent>
              <p>
                You can post a link from the following supported platforms and
                click <b>Add</b>. The following platforms are supported:
              </p>
              <p className='mt-2 font-semibold'>
                Dribbble, Behance, Spotify, Instagram, Soundcloud, YouTube,
                Medium, Substack
              </p>
            </PopoverContent>
          </Popover>
        </div>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <label
                className={`hover:text-sorbet align-center flex cursor-pointer items-center justify-center ${panelClass} ${
                  loading ? 'opacity-50' : ''
                }`}
              >
                <input
                  type='file'
                  className='hidden'
                  onChange={handleImageUpload}
                  disabled={loading}
                  accept='image/*'
                />
                <ImagePlus size={20} />
              </label>
            </TooltipTrigger>
            <TooltipContent>Upload custom image as widget</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
};
