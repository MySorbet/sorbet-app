'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { parseAsBoolean } from 'nuqs';
import { useQueryState } from 'nuqs';
import { useState } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { User } from '@/types';

import { ContactMeDialog } from './contact-me/contact-me-dialog';
import { ControlBar } from './control-bar/control-bar';
import { EditProfileSheet } from './edit-profile-sheet/edit-profile-sheet';
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
  user: User;
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

  return (
    <div className='@container size-full'>
      <div className='@3xl:flex-row flex size-full flex-col items-center'>
        {/* Left part of the profile. desktop: full height and long enough to render profile details in desktop mode. */}
        {/* mobile: auto height and short enough to render profile details in mobile mode. */}
        <div className='@3xl:h-full @3xl:min-w-96 flex w-[328px] flex-col justify-between gap-6 p-6'>
          <ProfileDetails
            user={user}
            isMine={isMine}
            onEdit={() => setIsEditing(true)}
            onContactMe={() => setIsContactMeDialogOpen(true)}
          />
          {/* TODO: Could/should these buttons auto open the privy via a query param? */}
          {/* Temporarily just remove these buttons on mobile */}
          <div className={cn('@3xl:flex hidden gap-3')}>
            {isLoggedIn ? (
              <Button variant='secondary' asChild>
                <Link href='/dashboard'>Back to Dashboard</Link>
              </Button>
            ) : (
              !isMine && (
                <>
                  <Button variant='secondary' asChild>
                    <Link href='/signin'>Create my Sorbet</Link>
                  </Button>
                  <Button variant='ghost' asChild>
                    <Link href='/signin'>Login</Link>
                  </Button>
                </>
              )
            )}
          </div>
        </div>
        {/* The right side of the profile. Should handle scroll itself (except on mobile, where the whole page will scroll*/}
        <div className='@3xl:w-auto @3xl:h-full @3xl:overflow-y-auto w-full flex-1'>
          {showOnboarding ? (
            <div className='flex h-full w-full items-center justify-center'>
              <OnboardWithHandles onSubmit={handleAddMultipleWidgets} />
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.5, ease: 'easeOut' }}
            >
              <ErrorBoundary FallbackComponent={GridErrorFallback}>
                <WidgetGrid immutable={!isMine} />
              </ErrorBoundary>
            </motion.div>
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
