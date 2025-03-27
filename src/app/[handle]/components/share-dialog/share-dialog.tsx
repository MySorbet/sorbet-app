'use client';

import { useEffect } from 'react';

import { CopyButton } from '@/components/common/copy-button/copy-button';
import {
  Credenza,
  CredenzaBody,
  CredenzaContent,
  CredenzaDescription,
  CredenzaHeader,
  CredenzaTitle,
} from '@/components/common/credenza/credenza';
import { Button } from '@/components/ui/button';
import { useHasShared } from '@/hooks/profile/use-has-shared';
import { useAuth } from '@/hooks/use-auth';

import { SorbetQRCode } from './sorbet-qr-code';

export const ShareDialog = ({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
}) => {
  const hostname = window.location.hostname;
  const origin = window.location.origin;
  const { user } = useAuth();
  if (!user) throw new Error('ShareDialog requires a user');

  const handle = user.handle;
  if (!handle) throw new Error('ShareDialog requires a handle');

  const prettyUrl = `${hostname}/${handle}`;
  const fullUrl = `${origin}/${handle}`;

  // If the share dialog opens, remember in local storage
  const [, setHasShared] = useHasShared();
  useEffect(() => {
    open && setHasShared(true);
  }, [open, setHasShared]);

  return (
    <Credenza open={open} onOpenChange={setOpen}>
      <CredenzaContent>
        <CredenzaHeader>
          <CredenzaTitle>Share on socials</CredenzaTitle>
          <CredenzaDescription>
            Share your profile on X, copy your link, or direct people to your
            Sorbet profile via QR code
          </CredenzaDescription>
        </CredenzaHeader>
        <CredenzaBody className='flex flex-col gap-4'>
          {/* TODO: Use an improved readonly handle input for this */}
          <CopyButton
            className='w-full flex-row-reverse justify-between'
            stringToCopy={fullUrl}
          >
            {prettyUrl}
          </CopyButton>
          <SorbetQRCode url={fullUrl} handle={handle} />
          <Button variant='sorbet' asChild>
            <a
              href={`https://www.x.com/intent/tweet?text=I%20just%20created%20my%20Sorbet%20profile%20🍧!%20Check%20it%20out%20here:&url=${prettyUrl}/`}
              target='_blank'
              rel='noopener noreferrer'
            >
              Share on X
            </a>
          </Button>
        </CredenzaBody>
      </CredenzaContent>
    </Credenza>
  );
};
