import { HelpCircle, Link03 } from '@untitled-ui/icons-react';
import { ImagePlus } from 'lucide-react';
import React, { useState } from 'react';

import { Spinner } from '@/components/common';
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

import { InvalidAlert } from './invalid-alert';
import { isValidUrl, normalizeUrl, parseWidgetTypeFromUrl } from './util';

interface AddWidgetsProps {
  /** Callback for when a url is added. `image` is defined if adding an image  */
  addUrl: (url: string, image?: File) => void;
  /** Should the component be loading? */
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
  const [errorInvalidImage, showErrorInvalidImage] = useState(false);
  const [disabled, setDisabled] = useState(true);

  const handleUrlSubmit = () => {
    if (loading) return;

    try {
      // This can only be triggered when the url is valid
      // So this is just for safety
      if (!isValidUrl(url)) {
        throw new Error('Something is not right with the link');
      }

      // Normalize the URL and throw an error if it's invalid
      // Again, since isValidUrl is true, this should never happen, but just in case
      const normalizedUrl = normalizeUrl(url);
      if (!normalizedUrl) {
        throw new Error('Something is not right with the link');
      }

      // Parse the url here so that it throws an error to display if it is unsupported
      parseWidgetTypeFromUrl(normalizedUrl);
      // If the above doesn't throw, we're good to add the url
      addUrl(normalizedUrl);
    } catch (error) {
      if (error instanceof Error) {
        // This is an expected error so display it to the user
        setError(error.message);
      } else {
        // This is an unexpected error so log it and display a generic error to the user
        console.error('unexpected error', error);
        setError('Something went wrong');
      }
    }
  };

  const handleUrlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (loading) return;

    const currentUrl = event.target.value;
    setUrl(currentUrl);

    // Clear the error if the user deletes the url
    if (error && !currentUrl) {
      setError(undefined);
    }

    // Can't add an empty or invalid url
    setDisabled(!currentUrl || !isValidUrl(currentUrl));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : undefined;
    if (file) {
      const validExtensions = ['jpg', 'jpeg', 'png', 'gif', 'svg'];
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

  const loadingClasses = 'opacity-90 pointer-events-none';

  return (
    <div
      className={cn(
        'isolate hidden max-w-96 md:block',
        loading && loadingClasses
      )}
    >
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
            <p>{error}</p>
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
              You can only upload jpg, png, svg, or gif files only.
            </p>
            <p>Maximum 10mb file size</p>
          </InvalidAlert>
        </div>
      )}

      <div
        className={cn(
          'z-10 flex w-full flex-row gap-4 rounded-2xl bg-white px-4 py-3 drop-shadow-xl',
          loading && loadingClasses
        )}
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
                Paste a link from the following platforms and click <b>Add</b>:
              </p>
              <p className='mt-2 font-semibold'>
                Dribble, Behance, Spotify, Instagram, Soundcloud, Youtube,
                Medium, Substack, Twitter, GitHub
              </p>
            </PopoverContent>
          </Popover>
        </div>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <label
                className={cn(
                  'hover:text-sorbet align-center flex cursor-pointer items-center justify-center',
                  loading && loadingClasses
                )}
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
