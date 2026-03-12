'use client';

import { Share2 } from 'lucide-react';
import { useRef, useState } from 'react';
import { toast } from 'sonner';

import { generateHandle } from '@/api/auth';
import { SorbetQRCode } from '@/app/[handle]/components/share-dialog/sorbet-qr-code';
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
import { Spinner } from '@/components/common/spinner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks/use-auth';
import { useIsMobile } from '@/hooks/use-mobile';

/**
 * Share button + dialog for the Accounts page.
 * Opens a sharing hub with the user's public accounts link,
 * copy button, QR code, and share on X.
 */
export const ShareAccountsButton = () => {
  const [open, setOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const { user, dangerouslySetUser } = useAuth();
  const isMobile = useIsMobile();

  const handleShareClick = async () => {
    if (!user) return;

    let handle = user.handle;
    
    // Generate handle on the fly for legacy users
    if (!handle) {
      setIsGenerating(true);
      try {
        handle = await generateHandle();
        dangerouslySetUser({ ...user, handle });
      } catch (error) {
        toast.error('Failed to generate sharing link. Please try again later.');
        setIsGenerating(false);
        return;
      }
      setIsGenerating(false);
    }

    const shareUrl = `${window.location.origin}/${handle}/accounts`;
    const shareTitle = 'My Sorbet Bank Accounts';
    const shareText = 'Pay me easily with my Sorbet bank accounts 🍧';

    // Use native Web Share API on mobile devices if supported
    if (isMobile && navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: shareUrl,
        });
        return;
      } catch (error) {
        // If users cancel the native share sheet, it throws an AbortError.
        // We can safely ignore that. Otherwise fall through to the dialog.
        if (error instanceof Error && error.name === 'AbortError') {
          return;
        }
      }
    }

    // Fallback to dialog on desktop or if native share fails/unsupported
    setOpen(true);
  };

  return (
    <>
      <Button
        variant='outline'
        onClick={handleShareClick}
        disabled={isGenerating}
      >
        {isGenerating ? (
          <Spinner className='mr-2 size-4' />
        ) : (
          <Share2 className='mr-2 size-4' />
        )}
        Share
      </Button>
      <ShareAccountsDialog open={open} setOpen={setOpen} />
    </>
  );
};

const ShareAccountsDialog = ({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
}) => {
  const hostname = window.location.hostname;
  const origin = window.location.origin;
  const { user } = useAuth();
  const copyButtonRef = useRef<CopyIconButtonHandle>(null);

  if (!user?.handle) return null;

  const handle = user.handle;
  const prettyUrl = `${hostname}/${handle}/accounts`;
  const fullUrl = `${origin}/${handle}/accounts`;

  return (
    <Credenza open={open} onOpenChange={setOpen}>
      <CredenzaContent>
        <CredenzaHeader>
          <CredenzaTitle>Share your accounts</CredenzaTitle>
          <CredenzaDescription>
            Share your bank account details with clients so they can pay you
            directly
          </CredenzaDescription>
        </CredenzaHeader>
        <CredenzaBody className='flex flex-col gap-4'>
          <Input
            value={`${handle}/accounts`}
            prefix={`${hostname}/`}
            aria-label='Copy accounts link'
            suffix={
              <CopyIconButton
                ref={copyButtonRef}
                stringToCopy={fullUrl}
                aria-label='Copy accounts link'
              />
            }
            readOnly
            tabIndex={-1}
            rootClassName='group cursor-pointer'
            className='hover:bg-muted cursor-pointer focus-visible:ring-0 focus-visible:ring-offset-0'
            onClick={() => copyButtonRef.current?.copy()}
          />

          <SorbetQRCode url={fullUrl} handle={handle} />
        </CredenzaBody>
        <CredenzaFooter>
          <Button variant='sorbet' asChild>
            <a
              href={`https://www.x.com/intent/tweet?text=Pay%20me%20easily%20with%20my%20Sorbet%20bank%20accounts%20🍧&url=${prettyUrl}/`}
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
