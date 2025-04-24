'use client';

import { motion } from 'framer-motion';
import { parseAsBoolean } from 'nuqs';
import { useQueryState } from 'nuqs';
import { useState } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

import { useMediaQuery } from '@/hooks/use-media-query';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { UserPublic } from '@/types';

import { ifValidImage } from '../util';
import { ArtificialMobile } from './artificial-mobile';
import { ContactMeDialog } from './contact-me/contact-me-dialog';
import { ControlBar } from './control-bar/control-bar';
import { EditProfileSheet } from './edit-profile-sheet/edit-profile-sheet';
import { ExitLinks } from './exit-links';
import { FileDropArea } from './file-drop-area';
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
  user: UserPublic;
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

  // This is the mobile detection we use many other places in the app. We use it to disable editing here.
  const isMobileDevice = useIsMobile();

  // Whether or not we are using ArtificialMobile to simulate a mobile layout. Set by the mobile switch in the control bar.
  const [isArtificialMobile, setIsArtificialMobile] = useState(false);

  // [81rem] is the breakpoint at which we switch from a vertical mobile layout to a horizontal desktop layout
  // We arrive at this number by finding the maximum width that can show both the left info section and the right widget grid
  // We need to bring this breakpoint into state so that we can hide and show the mobile switch.
  // Note that the media and container query are equivalent b/c of size-full all the way up.
  const isMobileScreen = useMediaQuery('(max-width: 81rem)');

  // Do not show artificial mobile if we are on a screen size where the profile would go into mobile mode
  const showArtificialMobile = isArtificialMobile && !isMobileScreen;

  const handleFileDrop = (file: File) => {
    ifValidImage(addImage)(file);
  };

  return (
    <>
      <ArtificialMobile
        isMobile={showArtificialMobile}
        className={cn(showArtificialMobile && 'pb-24')}
      >
        <div className='@container size-full'>
          {/* Main row or col of the profile. */}
          <div className='@[81rem]:flex-row @[81rem]:overflow-y-visible flex size-full flex-col items-center overflow-y-auto'>
            {/* Left info section. desktop: full height and long enough width to render its child in desktop mode. */}
            {/* mobile: auto height and short enough to render profile details in mobile mode. */}
            <div
              className={cn(
                '@[81rem]:h-full @[81rem]:min-w-96 flex w-[328px] flex-col justify-between gap-6 p-6',
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
                className='@[81rem]:flex hidden'
              />
            </div>
            {/* The right side of the profile. Desktop: Handles scroll itself. Mobile: Scrolls the parent container */}
            <div className='@[81rem]:max-w-none @[81rem]:h-full @[81rem]:overflow-y-auto @[81rem]:flex-1 w-full max-w-[895px]'>
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
                    // Little hack to make sure control bar doesn't overlap the bottommost widget controls
                    className={cn(!showArtificialMobile && '@[81rem]:mb-20')}
                  >
                    <ErrorBoundary FallbackComponent={GridErrorFallback}>
                      <FileDropArea onFileDrop={handleFileDrop}>
                        <WidgetGrid immutable={!isMine || isMobileDevice} />
                      </FileDropArea>
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
                        '@[81rem]:hidden w-full items-center justify-center p-6',
                        isMine && !showArtificialMobile && 'mb-20'
                      )}
                    />
                  </motion.div>
                </>
              )}
            </div>
          </div>
        </div>
      </ArtificialMobile>

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
                  isDisabled={isMobileDevice}
                  isMobile={isArtificialMobile}
                  onIsMobileChange={
                    isMobileScreen ? undefined : setIsArtificialMobile
                  }
                />
              </motion.div>
            </div>
          )}
        </>
      )}
    </>
  );
};
