import { InvalidAlert } from '@/components/profile';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
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
import { validateUrl } from '@/utils/url';
import { Link, CircleHelp, CircleAlert, ImagePlus, X } from 'lucide-react';
import React, { useState } from 'react';

interface AddWidgetsProps {
  addUrl: (url: string) => void;
}

export const AddWidgets: React.FC<AddWidgetsProps> = ({ addUrl }) => {
  const [url, setUrl] = useState<string>('');
  const [error, showError] = useState<boolean>(false);

  const handleUrlSubmit = () => {
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
  };

  const handleUrlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const currentUrl = event.target.value;
    setUrl(currentUrl);

    if (error && currentUrl === '') {
      showError(false);
    }
  };

  const handleShowErrorAlert = (status: boolean) => {
    showError(status);
  };

  return (
    <div className='lg:w-[480px]'>
      {error && (
        <div
          className={`transition-transform duration-500 ${
            error ? 'translate-y-0' : '-translate-y-1'
          }`}
        >
          <div className='mb-2'>
            <InvalidAlert handleAlertVisible={handleShowErrorAlert} />
          </div>
        </div>
      )}
      <div className='flex flex-row gap-4 bg-white p-4 shadow-lg shadow-gray-200 rounded-2xl w-full'>
        <div
          className={cn(
            'flex items-center border-2 py-2 px-3 rounded-2xl flex-grow',
            error ? 'border-red-500' : 'border-gray-300'
          )}
        >
          <div>
            <Link className='mr-2' size={22} />
          </div>
          <input
            type='text'
            className='outline-none flex-1'
            placeholder='Add a url...'
            onChange={handleUrlChange}
            value={url}
          />
          <div>
            <button
              type='submit'
              className='cursor-pointer flex-none bg-[#573DF5] text-white px-4 text-sm py-1 rounded-lg'
              onClick={handleUrlSubmit}
            >
              Add
            </button>
          </div>
          <div className='ml-2 text-gray-500 cursor-pointer'>
            <Popover>
              <PopoverTrigger asChild>
                <CircleHelp size={20} />
              </PopoverTrigger>
              <PopoverContent>
                <p>
                  You can post a link from the following supported platforms and
                  click <b>Add</b>. The following platforms are supported:
                </p>
                <p className='font-semibold mt-2'>
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
              <button
                type='submit'
                className='cursor-pointer flex-none hover:text-sorbet'
                onClick={handleUrlSubmit}
              >
                <ImagePlus size={24} />
              </button>
            </TooltipTrigger>
            <TooltipContent>Upload custom image as widget</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
};
