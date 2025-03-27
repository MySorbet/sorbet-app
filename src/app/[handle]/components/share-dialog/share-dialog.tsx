'use client';

import { useEffect, useRef } from 'react';

import {
  type CopyIconButtonHandle,
  CopyIconButton,
} from '@/components/common/copy-button/copy-icon-button';
import {
  Credenza,
  CredenzaBody,
  CredenzaContent,
  CredenzaDescription,
  CredenzaFooter,
  CredenzaHeader,
  CredenzaTitle,
} from '@/components/common/credenza/credenza';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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

  const copyButtonRef = useRef<CopyIconButtonHandle>(null);

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
          <Input
            value={handle}
            prefix={`${hostname}/`}
            aria-label='Copy profile link'
            suffix={
              <CopyIconButton
                ref={copyButtonRef}
                stringToCopy={fullUrl}
                aria-label='Copy profile link'
              />
            }
            readOnly
            rootClassName='group cursor-pointer'
            className='hover:bg-muted cursor-pointer focus-visible:ring-0 focus-visible:ring-offset-0'
            onClick={() => copyButtonRef.current?.copy()}
          />

          <SorbetQRCode url={fullUrl} handle={handle} />
        </CredenzaBody>
        <CredenzaFooter>
          <Button variant='sorbet' asChild>
            <a
              href={`https://www.x.com/intent/tweet?text=I%20just%20created%20my%20Sorbet%20profile%20🍧!%20Check%20it%20out%20here:&url=${prettyUrl}/`}
              target='_blank'
              rel='noopener noreferrer'
              className='w-full'
            >
              Share on X
            </a>
          </Button>
        </CredenzaFooter>
      </CredenzaContent>
    </Credenza>
  );
};
