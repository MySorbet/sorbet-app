import { Coffee, MapPin } from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn, formatName, formatWalletAddress } from '@/lib/utils';
import { MinimalUser } from '@/types';
import AvatarFallbackSVG from '~/svg/avatar-fallback.svg';

import { useConnectAndSend } from '../hooks/use-connect-and-send';
import { useWalletAddressByUserId } from '@/hooks/use-wallet-address-by-user-id';

/** Profile details section rendered as a column on the left of the profile page */
export const ProfileDetails = ({
  user,
  isMine,
  onEdit,
  className,
}: {
  user: MinimalUser;
  isMine?: boolean;
  onEdit?: () => void;
  className?: string;
}) => {
  if (!user) throw new Error('ProfileDetails requires a user');

  // Prepare content for display
  const name = formatName(user.firstName, user.lastName) || 'Your name';
  const bio = user.bio || 'Add bio...';
  const showTags = Boolean(user.tags || user.city);

  return (
    <div className={cn('flex flex-col gap-6', className)}>
      <Avatar className='size-32'>
        <AvatarImage src={user.profileImage} alt='new profile image' />
        <AvatarFallback>
          <AvatarFallbackSVG className='size-full' />
        </AvatarFallback>
      </Avatar>
      <div className='space-y-2'>
        <h1 className='text-3xl font-semibold'>{name}</h1>
        <p className='text-muted-foreground text-lg'>{bio}</p>
      </div>
      {showTags && (
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
      )}
      {isMine ? (
        <MyProfileButtons onEdit={onEdit} />
      ) : (
        <PublicProfileButtons userId={user.id} />
      )}
    </div>
  );
};

/** Buttons for public view of a profile */
const PublicProfileButtons = ({ userId }: { userId: string }) => {
  const { data: walletAddress } = useWalletAddressByUserId(userId);
  const { wallet, connectWallet, send } = useConnectAndSend({
    amount: 1,
    recipientWalletAddress: walletAddress,
    // recipientWalletAddress: '0xBB5923098D84EB0D9DAaE2975782999364CE87A2' //uncomment for SB,
    sendAfterConnect: false,
  });
  return (
    <div className='flex flex-col gap-3'>
      <Button variant='sorbet' disabled>
        Work with me
      </Button>
      <Button
        variant='secondary'
        onClick={() => (!wallet ? connectWallet() : send())}
      >
        <Coffee /> {wallet ? 'Tip USDC' : 'Connect Wallet to Tip'}
      </Button>
      {wallet && (
        <Button variant='destructive' onClick={() => wallet?.disconnect()}>
          Disconnect ({formatWalletAddress(wallet?.address)})
        </Button>
      )}
    </div>
  );
};

/** Buttons for when a user is viewing their own profile */
const MyProfileButtons = ({ onEdit }: { onEdit?: () => void }) => {
  return (
    <Button variant='sorbet' className='w-fit' onClick={onEdit}>
      Edit profile
    </Button>
  );
};
