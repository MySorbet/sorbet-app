'use client';

import { Dispatch, SetStateAction, useState } from 'react';

import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

import {
  AddToSocials,
  Instagram,
  ShareMyProfileTo,
  ShareOnSocials,
  ShareYourProfile,
  XTwitter,
} from './views/index';

const screenOptions = [
  'ShareYourProfile',
  'AddToSocials',
  'ShareMyProfileTo',
  'ShareOnSocials',
  'Instagram',
  'X',
] as const;
export type View = (typeof screenOptions)[number];

interface ShareProfileModalProps {
  trigger: React.ReactNode;
  username: string;
}

export interface ViewProps {
  username: string;
  setActive: Dispatch<SetStateAction<View>>;
  handleUrlToClipboard: () => void;
}

export const ShareProfileDialog = ({
  trigger,
  username,
}: ShareProfileModalProps) => {
  const [activeView, setActive] = useState<View>('ShareYourProfile');

  const handleUrlToClipboard = () => {
    const url = `${window.location.origin}/${username}`;
    navigator.clipboard.writeText(url);
  };

  return (
    <Dialog>
      <DialogTrigger>{trigger}</DialogTrigger>
        <DialogContent
          className={cn(
            'flex w-[400px] flex-col items-center rounded-3xl bg-[#F9F7FF] p-4 sm:rounded-3xl',
            `gap-6`
          )}
          customDialogClose='hidden'
          aria-describedby='Share your profile!'
        >
          {activeView === 'ShareYourProfile' && (
            <ShareYourProfile
              username={username}
              setActive={setActive}
              handleUrlToClipboard={handleUrlToClipboard}
            />
          )}
          {activeView === 'AddToSocials' && (
            <AddToSocials setActive={setActive} />
          )}
          {activeView === 'ShareMyProfileTo' && (
            <ShareMyProfileTo
              username={username}
              setActive={setActive}
              handleUrlToClipboard={handleUrlToClipboard}
            />
          )}
          {activeView === 'ShareOnSocials' && (
            <ShareOnSocials
              username={username}
              setActive={setActive}
              handleUrlToClipboard={handleUrlToClipboard}
            />
          )}
          {activeView === 'Instagram' && (
            <Instagram
              username={username}
              setActive={setActive}
              handleUrlToClipboard={handleUrlToClipboard}
            />
          )}
          {activeView === 'X' && (
            <XTwitter
              username={username}
              setActive={setActive}
              handleUrlToClipboard={handleUrlToClipboard}
            />
          )}
        </DialogContent>
    </Dialog>
  );
};
