'use client';

import { Dispatch, SetStateAction, useState } from 'react';

import { Dialog, DialogTrigger, DialogContent } from '@/components/ui/dialog';

import { motion } from 'framer-motion';

import {
  AddToSocials,
  Instagram,
  ShareMyProfile,
  ShareOnSocials,
  ShareYourProfile,
  XTwitter,
} from './views/index';
import { cn } from '@/lib/utils';

const screenOptions = [
  'ShareYourProfile',
  'AddToSocials',
  'ShareMyProfileTo',
  'ShareOnSocials',
  'Instagram',
  'X',
] as const;
export type Screen = (typeof screenOptions)[number];

interface ShareProfileModalProps {
  trigger: React.ReactNode;
  username: string;
}

export interface ViewProps {
  username: string;
  setActive: Dispatch<SetStateAction<Screen>>;
  handleUrlToClipboard?: () => void;
}

export const ShareProfileDialog = ({
  trigger,
  username,
}: ShareProfileModalProps) => {
  const [active, setActive] = useState<Screen>('ShareYourProfile');

  const handleUrlToClipboard = () => () => {
    const url = `${window.location.origin}/${username}`;
    navigator.clipboard.writeText(url);
  };

  return (
    <Dialog>
      <DialogTrigger>{trigger}</DialogTrigger>
      <motion.div layout='size'>
        <DialogContent
          className={cn(
            'flex  w-[400px] flex-col items-center rounded-3xl bg-[#F9F7FF] p-4 sm:rounded-3xl',
            `gap-6`
          )}
          customDialogClose='hidden'
          aria-description='Share your profile!'
        >
          {active === 'ShareYourProfile' && (
            <ShareYourProfile
              username={username}
              setActive={setActive}
              handleUrlToClipboard={handleUrlToClipboard}
            />
          )}
          {active === 'AddToSocials' && <AddToSocials setActive={setActive} />}
          {active === 'ShareMyProfileTo' && (
            <ShareMyProfile
              username={username}
              setActive={setActive}
              handleUrlToClipboard={handleUrlToClipboard}
            />
          )}
          {active === 'ShareOnSocials' && (
            <ShareOnSocials
              username={username}
              setActive={setActive}
              handleUrlToClipboard={handleUrlToClipboard}
            />
          )}
          {active === 'Instagram' && (
            <Instagram username={username} setActive={setActive} />
          )}
          {active === 'X' && (
            <XTwitter username={username} setActive={setActive} />
          )}
        </DialogContent>
      </motion.div>
    </Dialog>
  );
};
