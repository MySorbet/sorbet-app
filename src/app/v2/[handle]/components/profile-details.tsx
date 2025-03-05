import { Coffee, MapPin } from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { User } from '@/types/user';
import AvatarFallbackSVG from '~/svg/avatar-fallback.svg';

/** Profile details section rendered as a column on the left of the profile page */
export const ProfileDetails = ({
  user,
  className,
}: {
  user: User;
  className?: string;
}) => {
  if (!user) throw new Error('ProfileDetails requires a user');
  const name = `${user.firstName} ${user.lastName}`.trim();

  // TODO: Implement a freelancer view. Currently this is just the public view

  return (
    <div className={cn('flex flex-col gap-6', className)}>
      <Avatar className='size-32'>
        <AvatarImage src={user.profileImage} alt='new profile image' />
        <AvatarFallback>
          <AvatarFallbackSVG className='size-full' />
        </AvatarFallback>
      </Avatar>
      <h1 className='text-3xl font-semibold'>{name}</h1>
      <p className='text-muted-foreground text-lg'>{user.bio}</p>
      <div className='flex flex-wrap gap-2'>
        {user.city && (
          <Badge variant='secondary' key='location'>
            <MapPin className='mr-[0.125rem] size-3' />
            {user.city}
          </Badge>
        )}
        {user.tags?.map((tag: string) => (
          <Badge variant='secondary' key={tag}>
            {tag}
          </Badge>
        ))}
      </div>
      <div className='flex flex-col gap-3'>
        <Button variant='sorbet' disabled>
          Work with me
        </Button>
        <Button variant='secondary' disabled>
          <Coffee /> Tip USDC
        </Button>
      </div>
    </div>
  );
};
