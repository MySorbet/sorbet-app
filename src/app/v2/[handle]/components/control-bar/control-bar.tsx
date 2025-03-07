import { PopoverAnchor } from '@radix-ui/react-popover';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { Link2, Plus } from 'lucide-react';
import { toast } from 'sonner';

import { checkFileValid } from '@/components/profile/widgets/util';
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
  addImage,
}: {
  addImage?: (file: File) => void;
}) => {
  // Handle an image picked from the file system
  const handleAddImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; // Only support the first file (input should limit anyway)
    if (!file) return;
    if (checkFileValid(file)) {
      toast.success('Adding image...'); // TODO: Remove
      addImage?.(file);
    } else {
      toast.error('Invalid image');
    }
  };
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
                className='relative p-0'
                side='top'
                sideOffset={4}
              >
                <Input
                  type='url'
                  placeholder='paste link'
                  className='focus-visible:ring-transparent'
                />
                <Button
                  variant='sorbet'
                  className='absolute bottom-1.5 right-1.5 top-1.5 h-fit p-1'
                >
                  <Plus />
                </Button>
              </PopoverContent>
              <AddImageButton onAdd={handleAddImage} />
            </div>
          </CardContent>
        </Card>
      </PopoverAnchor>
    </Popover>
  );
};
