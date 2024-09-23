import { Play } from '@untitled-ui/icons-react';

import { Button } from '@/components/ui/button';

/**
 * Play button for Spotify and Soundcloud widgets
 */
export const PlayButton = () => {
  return (
    <Button
      variant='outline'
      className='h-fit rounded-full bg-[#FAFAFA] px-3 py-1 text-sm font-semibold'
    >
      <Play className='mr-1 size-4' />
      Play
    </Button>
  );
};
