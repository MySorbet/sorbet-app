'use client';

import { motion } from 'framer-motion';
import { parseAsBoolean } from 'nuqs';
import { useQueryState } from 'nuqs';
import { useState } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { MinimalUser } from '@/types';

import { ContactMeDialog } from './contact-me/contact-me-dialog';
import { ControlBar } from './control-bar/control-bar';
import { EditProfileSheet } from './edit-profile-sheet/edit-profile-sheet';
import { ExitLinks } from './exit-links';
import { OnboardWithHandles } from './onboard-with-handles/onboard-with-handles';
import { ProfileDetails } from './profile-details';
import { ShareDialog } from './share-dialog/share-dialog';
import { WidgetGrid } from './widget/grid';
import { GridErrorFallback } from './widget/grid-error-fallback';
import { useHandlePaste } from './widget/use-handle-paste';
import { useWidgets } from './widget/use-widget-context';

/** Profile 2.0 */
export const Profile = ({
  user,
  isMine,
  isLoggedIn,
}: {
  user: MinimalUser;
  isMine?: boolean;
  isLoggedIn?: boolean;
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isContactMeDialogOpen, setIsContactMeDialogOpen] = useState(false);

  const [isShareDialogOpen, setIsShareDialogOpen] = useQueryState(
    'shareDialogOpen',
    parseAsBoolean.withDefault(false)
  );

  const { addWidget, addImage, widgets, isLoading } = useWidgets();
  const showOnboarding =
    isMine && !isLoading && Object.keys(widgets).length === 0;

  const handleAddImage = async (image: File) => {
    addImage(image);
  };

  const handleAddLink = (link: string) => {
    addWidget(link);
  };

  const handleAddMultipleWidgets = async (urls: string[]) => {
    await Promise.all(urls.map(addWidget));
  };

  useHandlePaste(addWidget, isMine && !isLoading);

  // This hook fires at 768px, aligning perfectly with our @3xl breakpoint below
  const isMobile = useIsMobile();

  return (
    <div className='@container size-full'>
      <div className='@3xl:flex-row @3xl:overflow-y-visible flex size-full flex-col items-center overflow-y-auto'>
        {/* Left part of the profile. desktop: full height and long enough to render profile details in desktop mode. */}
        {/* mobile: auto height and short enough to render profile details in mobile mode. */}
        <div
          className={cn(
            '@3xl:h-full @3xl:min-w-96 flex w-[328px] flex-col justify-between gap-6 p-6',
            'animate-in fade-in-0 duration-500'
          )}
        >
          <ProfileDetails
            user={user}
            isMine={isMine}
            onEdit={() => setIsEditing(true)}
            onContactMe={() => setIsContactMeDialogOpen(true)}
          />
          <ExitLinks
            isLoggedIn={isLoggedIn}
            isMine={isMine}
            className='@3xl:flex hidden'
          />
        </div>
        {/* The right side of the profile. Should handle scroll itself (except on mobile, where the whole page will scroll*/}
        <div className='@3xl:w-auto @3xl:h-full @3xl:overflow-y-auto @3xl:flex-1 w-full'>
          {showOnboarding ? (
            <div className='flex h-full w-full items-center justify-center'>
              <OnboardWithHandles onSubmit={handleAddMultipleWidgets} />
            </div>
          ) : (
            <>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.5, ease: 'easeOut' }}
                className='@3xl:mb-20' // Little hack to make sure control bar doesn't overlap the bottommost widget controls
              >
                <ErrorBoundary FallbackComponent={GridErrorFallback}>
                  <WidgetGrid immutable={!isMine || isMobile} />
                </ErrorBoundary>
              </motion.div>
              {/* Little motion hack to prevent a flash of the exit links when the page loads */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={!isLoading ? { opacity: 1 } : { opacity: 0 }}
                transition={{ duration: 1, delay: 0.5 }}
              >
                <ExitLinks
                  isLoggedIn={isLoggedIn}
                  isMine={isMine}
                  className={cn(
                    '@3xl:hidden w-full items-center justify-center p-6',
                    isMine && 'mb-20'
                  )}
                />
              </motion.div>
            </>
          )}
        </div>

        {/* Elements which ignore the layout of this container */}
        <ContactMeDialog
          open={isContactMeDialogOpen}
          onOpenChange={setIsContactMeDialogOpen}
          userId={user.id}
        />
        {isMine && (
          <>
            <ShareDialog
              open={isShareDialogOpen}
              setOpen={setIsShareDialogOpen}
            />
            <EditProfileSheet
              open={isEditing}
              setOpen={setIsEditing}
              user={user}
            />
            {!showOnboarding && (
              <div className='fix-modal-layout-shift fixed bottom-0 left-1/2 -translate-x-1/2 -translate-y-6 transform'>
                <motion.div
                  initial={{ y: 100, opacity: 0 }}
                  animate={
                    !isLoading ? { opacity: 1, y: 0 } : { opacity: 0, y: 100 }
                  }
                  transition={{
                    delay: 1,
                    type: 'spring',
                    stiffness: 150,
                    damping: 30,
                    mass: 2,
                  }}
                >
                  <ControlBar
                    onAddImage={handleAddImage}
                    onAddLink={handleAddLink}
                    onShare={() => setIsShareDialogOpen(true)}
                    isMobile={isMobile}
                  />
                </motion.div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
