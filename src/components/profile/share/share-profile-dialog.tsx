'use client';

import { SetStateAction, useState, Dispatch } from 'react';

import { Dialog, DialogTrigger } from '@/components/ui/dialog';

import {
  AddToSocials,
  Instagram,
  ShareMyProfile,
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
type Screen = (typeof screenOptions)[number];

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
      {active === 'ShareYourProfile' && (
        <ShareYourProfile username={username} setActive={setActive} />
      )}
      {active === 'AddToSocials' && (
        <AddToSocials username={username} setActive={setActive} />
      )}
      {active === 'ShareMyProfileTo' && (
        <ShareMyProfile username={username} setActive={setActive} />
      )}
      {active === 'ShareOnSocials' && (
        <ShareOnSocials username={username} setActive={setActive} handleUrlToClipboard={handleUrlToClipboard}/>
      )}
      {active === 'Instagram' && (
        <Instagram username={username} setActive={setActive} />
      )}
      {active === 'X' && <XTwitter username={username} setActive={setActive} />}
    </Dialog>
  );
};
