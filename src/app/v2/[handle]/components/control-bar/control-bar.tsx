import { PopoverAnchor } from '@radix-ui/react-popover';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { Link2, Plus } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

import { AddImageButton } from './add-image-button';

// TODO: Add separator (with proper height) and button border
// TODO: Nail the size, border, and focus of the url input

/** Toolbar containing controls to edit and share the profile */
export const ControlBar = ({
  onAddImage,
}: {
  onAddImage?: (image: File) => void;
}) => {
  return (
    <Popover>
      <PopoverAnchor asChild>
        <Card className='h-fit shadow-lg'>
          <CardContent className='flex h-full items-center justify-between gap-4 px-3 py-2'>
            <Button variant='sorbet'>Share profile</Button>
            <div className='flex items-center gap-2'>
              <PopoverTrigger asChild>
                <Button variant='secondary' className='h-fit p-1'>
                  <Link2 />
                  <VisuallyHidden>Add link</VisuallyHidden>
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className='relative border-none p-0'
                side='top'
                sideOffset={4}
              >
                <Input
                  type='url'
                  placeholder='paste link'
                  className='focus-visible:ring-0 focus-visible:ring-offset-0'
                />
                <Button
                  variant='sorbet'
                  className='absolute bottom-0 right-2 top-0 my-auto h-fit p-1'
                >
                  <Plus />
                </Button>
              </PopoverContent>
              <AddImageButton onAdd={onAddImage} />
            </div>
          </CardContent>
        </Card>
      </PopoverAnchor>
    </Popover>
  );
};
