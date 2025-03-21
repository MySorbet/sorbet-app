'use client';

import { motion } from 'framer-motion';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import useMeasure from 'react-use-measure';

import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { useHasShared } from '@/hooks/profile/use-has-shared';

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
  /** You may provide a rendered component as a trigger and ShareProfileDialog will manage state */
  trigger?: React.ReactNode;
  /* The handle to share */
  username: string;
  /** You may also manage the open state of the dialog yourself. This is compatible with `trigger`*/
  open?: boolean;
  /** You may also manage the open state of the dialog yourself. This is compatible with `trigger`*/
  setOpen?: (open: boolean) => void;
}

export interface ViewProps {
  username: string;
  setActive: Dispatch<SetStateAction<View>>;
  handleUrlToClipboard: () => void;
}

export const ShareProfileDialog = ({
  trigger,
  username,
  open,
  setOpen,
}: ShareProfileModalProps) => {
  const [activeView, setActive] = useState<View>('ShareYourProfile');

  const handleUrlToClipboard = () => {
    const url = `${window.location.origin}/${username}`;
    navigator.clipboard.writeText(url);
  };

  const [contentRef, { height: contentHeight }] = useMeasure();

  // If the share dialog opens, remember in local storage
  const [, setHasShared] = useHasShared();
  useEffect(() => {
    open && setHasShared(true);
  }, [open, setHasShared]);

  return (
    <Dialog
      onOpenChange={(open) => {
        setActive('ShareYourProfile');
        setOpen?.(open);
      }}
      open={open}
    >
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent
        className='flex w-[400px] flex-col items-center gap-6 rounded-3xl bg-[#F9F7FF] p-4 sm:rounded-3xl'
        hideClose
        aria-describedby='Share your profile!'
      >
        <motion.div
          // TODO: address this hacky solution for the first view. For some reason, the height is not being calculated correctly when the dialog is opened.
          animate={{
            height: activeView === 'ShareYourProfile' ? '372px' : contentHeight,
          }}
          className='overflow-hidden'
        >
          <div ref={contentRef}>
            {activeView === 'ShareYourProfile' && (
              <FadeIn>
                <ShareYourProfile
                  username={username}
                  setActive={setActive}
                  handleUrlToClipboard={handleUrlToClipboard}
                />
              </FadeIn>
            )}
            {activeView === 'AddToSocials' && (
              <FadeIn>
                <AddToSocials setActive={setActive} />
              </FadeIn>
            )}
            {activeView === 'ShareMyProfileTo' && (
              <FadeIn>
                <ShareMyProfileTo
                  username={username}
                  setActive={setActive}
                  handleUrlToClipboard={handleUrlToClipboard}
                />
              </FadeIn>
            )}
            {activeView === 'ShareOnSocials' && (
              <FadeIn>
                <ShareOnSocials
                  username={username}
                  setActive={setActive}
                  handleUrlToClipboard={handleUrlToClipboard}
                />
              </FadeIn>
            )}
            {activeView === 'Instagram' && (
              <FadeIn>
                <Instagram
                  username={username}
                  setActive={setActive}
                  handleUrlToClipboard={handleUrlToClipboard}
                />
              </FadeIn>
            )}
            {activeView === 'X' && (
              <FadeIn>
                <XTwitter
                  username={username}
                  setActive={setActive}
                  handleUrlToClipboard={handleUrlToClipboard}
                />
              </FadeIn>
            )}
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};

/** All this does is animate the opacity of each component and adds a delay for better timing */
const FadeIn = ({ children }: { children: React.ReactNode }) => {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      {children}
    </motion.div>
  );
};
