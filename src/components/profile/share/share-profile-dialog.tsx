'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { Dispatch, SetStateAction, useState } from 'react';
import useMeasure from 'react-use-measure';

import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';

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

  const [contentRef, { height: contentHeight }] = useMeasure();

  console.log(contentHeight);

  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent
        className='flex w-[400px] flex-col items-center gap-6 rounded-3xl bg-[#F9F7FF] p-4 sm:rounded-3xl'
        customDialogClose='hidden'
        aria-describedby='Share your profile!'
      >
        <motion.div
          // TODO: address this hacky solution for the first view. For some reason, the height is not being calculated correctly when the dialog is opened.
          animate={{
            height: activeView === 'ShareYourProfile' ? '372px' : contentHeight,
          }}
          className='overflow-hidden'
        >
          <AnimatePresence>
            <div ref={contentRef}>
              {activeView === 'ShareYourProfile' && (
                <AnimatedContainer>
                  <ShareYourProfile
                    username={username}
                    setActive={setActive}
                    handleUrlToClipboard={handleUrlToClipboard}
                  />
                </AnimatedContainer>
              )}
              {activeView === 'AddToSocials' && (
                <AnimatedContainer>
                  <AddToSocials setActive={setActive} />
                </AnimatedContainer>
              )}
              {activeView === 'ShareMyProfileTo' && (
                <AnimatedContainer>
                  <ShareMyProfileTo
                    username={username}
                    setActive={setActive}
                    handleUrlToClipboard={handleUrlToClipboard}
                  />
                </AnimatedContainer>
              )}
              {activeView === 'ShareOnSocials' && (
                <AnimatedContainer>
                  <ShareOnSocials
                    username={username}
                    setActive={setActive}
                    handleUrlToClipboard={handleUrlToClipboard}
                  />
                </AnimatedContainer>
              )}
              {activeView === 'Instagram' && (
                <AnimatedContainer>
                  <Instagram
                    username={username}
                    setActive={setActive}
                    handleUrlToClipboard={handleUrlToClipboard}
                  />
                </AnimatedContainer>
              )}
              {activeView === 'X' && (
                <AnimatedContainer>
                  <XTwitter
                    username={username}
                    setActive={setActive}
                    handleUrlToClipboard={handleUrlToClipboard}
                  />
                </AnimatedContainer>
              )}
            </div>
          </AnimatePresence>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};

const AnimatedContainer = ({ children }: { children: React.ReactNode }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.1 }}
    >
      {children}
    </motion.div>
  );
};
