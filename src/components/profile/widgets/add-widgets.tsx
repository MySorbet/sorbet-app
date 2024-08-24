import { Spinner } from '@/components/common';
import { InvalidAlert } from '@/components/profile';
import { validateUrl } from '@/components/profile/widgets';
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
import { Link, CircleHelp, ImagePlus } from 'lucide-react';
import React, { useState } from 'react';

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
  const [error, showError] = useState<boolean>(false);
  const [errorInvalidImage, showErrorInvalidImage] = useState<boolean>(false);

  const handleUrlSubmit = () => {
    if (!loading) {
      try {
        const isValid: boolean = validateUrl(url);
        if (!isValid) {
          showError(true);
          return;
        }

        addUrl(url);
      } catch (error) {
        showError(true);
      }
    }
  };

  const handleUrlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!loading) {
      const currentUrl = event.target.value;
      setUrl(currentUrl);

      if (error && currentUrl === '') {
        showError(false);
      }
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : undefined;
    if (file) {
      const validExtensions = ['jpg', 'jpeg', 'png', 'gif'];
      const fileSize = file.size / 1024 / 1024; // in MB
      const fileExtension = file.name.split('.').pop()?.toLowerCase();

      if (validExtensions.includes(fileExtension!) && fileSize <= 10) {
        addUrl('https://storage.googleapis.com', file);
      } else {
        showErrorInvalidImage(true);
      }
    }
  };

  const panelClass = loading ? 'opacity-70 pointer-events-none' : '';

  return (
    <div className={`isolate hidden md:block lg:w-[480px] ${panelClass}`}>
      {error && (
        <div className='animate-in slide-in-from-bottom-8 z-0 mb-2'>
          <InvalidAlert
            handleAlertVisible={(status: boolean) => {
              showError(status);
              setUrl('');
            }}
            title='Link not supported'
          >
            <p className='mt-2'>We only support the following links:</p>
            <p className='font-semibold'>
              Dribble, Behance, Spotify, Instagram, Soundcloud, Youtube, Medium,
              Substack, Twitter, GitHub
            </p>
          </InvalidAlert>
        </div>
      )}

      {errorInvalidImage && (
        <div className={'animate-in slide-in-from-bottom-8 z-0 mb-2'}>
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
        className={`z-10 flex w-full flex-row gap-2 rounded-2xl bg-white p-2 drop-shadow-xl lg:gap-4 lg:p-4 ${panelClass}`}
      >
        <div
          className={cn(
            'flex flex-grow items-center rounded-2xl border-2 px-2 py-1 lg:px-3 lg:py-2',
            error ? 'border-red-500' : 'border-gray-300'
          )}
        >
          <div>
            <Link className='mr-2' size={22} />
          </div>
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
            <button
              type='submit'
              className='flex-none cursor-pointer rounded-lg bg-[#573DF5] px-4 py-1 text-xs text-white lg:text-sm'
              disabled={loading}
            >
              {loading ? <Spinner size='small' /> : <span>Add</span>}
            </button>
          </form>
          <div className='ml-2 cursor-pointer text-gray-500'>
            <Popover>
              <PopoverTrigger asChild>
                <CircleHelp size={20} />
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
                <ImagePlus size={24} />
              </label>
            </TooltipTrigger>
            <TooltipContent>Upload custom image as widget</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
};
