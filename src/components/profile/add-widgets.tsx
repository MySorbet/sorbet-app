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
import { validateUrl } from '@/utils/url';
import { Link, CircleHelp, Upload, ImagePlus } from 'lucide-react';
import React, { useState } from 'react';

interface AddWidgetsProps {
  addUrl: (url: string) => void;
}

export const AddWidgets: React.FC<AddWidgetsProps> = ({ addUrl }) => {
  const [url, setUrl] = useState<string>('');
  const [error, showError] = useState<boolean>(false);

  const handleUrlSubmit = () => {
    const isValid: boolean = validateUrl(url);
    if (!isValid) {
      showError(true);
      return;
    }

    addUrl(url);
  };

  return (
    <div className='flex flex-row gap-4 bg-white p-4 shadow-lg shadow-gray-200 rounded-2xl min-w-[450px] w-full'>
      <div className='flex items-center border-2 py-2 px-3 rounded-2xl border-gray-300 flex-grow'>
        <div>
          <Link className='mr-2' size={22} />
        </div>
        <input
          type='text'
          className='outline-none flex-1'
          placeholder='Add a url...'
          onChange={(event) => setUrl(event.target.value)}
          value={url}
        />
        <div className='ml-2 text-gray-500 cursor-pointer'>
          <Popover>
            <PopoverTrigger asChild>
              <CircleHelp size={20} />
            </PopoverTrigger>
            <PopoverContent>
              You can paste links from the following platforms here to share you
              works:
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              type='submit'
              className='cursor-pointer flex-none'
              onClick={handleUrlSubmit}
            >
              <Upload size={24} />
            </button>
          </TooltipTrigger>
          <TooltipContent>Create Widget</TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              type='submit'
              className='cursor-pointer flex-none'
              onClick={handleUrlSubmit}
            >
              <ImagePlus size={24} />
            </button>
          </TooltipTrigger>
          <TooltipContent>Upload custom image as widget</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};
