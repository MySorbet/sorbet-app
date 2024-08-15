'use client';

import { useState } from 'react';

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
  username: string
}

export const ShareProfileDialog = ({ trigger }: ShareProfileModalProps) => {
  const [active, setActive] = useState<Screen>('ShareYourProfile');

  return (
    <Dialog>
      <DialogTrigger>{trigger}</DialogTrigger>
      {active === 'ShareYourProfile' && <ShareYourProfile />}
      {active === 'AddToSocials' && <AddToSocials />}
      {active === 'ShareMyProfileTo' && <ShareMyProfile />}
      {active === 'ShareOnSocials' && <ShareOnSocials />}
      {active === 'Instagram' && <Instagram />}
      {active === 'X' && <XTwitter />}
    </Dialog>
  );
};
