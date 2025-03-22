'use client';

import Link from 'next/link';
import { useState } from 'react';
import { toast } from 'sonner';

// TODO: Move to ./components
import { EditProfileSheet } from '@/components/profile/edit-profile-sheet';
import { Button } from '@/components/ui/button';
import { User } from '@/types';

import { ControlBar } from './control-bar/control-bar';
import { ProfileDetails } from './profile-details';
import { ShareDialog } from './share-dialog/share-dialog';
import { WidgetGrid } from './widget/grid';
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
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);

  const { addWidget } = useWidgets();

  const handleAddImage = (image: File) => {
    toast.success('Would add image', {
      description: image.name,
    });
  };

  const handleAddLink = (link: string) => {
    addWidget(link);
  };

  return (
    <div className='@container size-full'>
      <div className='@3xl:flex-row flex size-full flex-col items-center'>
        <div className='@3xl:w-auto flex h-full w-[470px] max-w-96 flex-col justify-between gap-6 p-6 pb-0'>
          <ProfileDetails
            user={user}
            isMine={isMine}
            onEdit={() => setIsEditing(true)}
          />
          {/* TODO: Could/should these buttons auto open the privy via a query param? */}
          {!isMine && (
            <div className='flex gap-3'>
              {isLoggedIn ? (
                <Button variant='secondary' asChild>
                  <Link href='/'>My Sorbet</Link>
                </Button>
              ) : (
                <>
                  <Button variant='secondary' asChild>
                    <Link href='/signin'>Create my Sorbet</Link>
                  </Button>
                  <Button variant='ghost' asChild>
                    <Link href='/signin'>Login</Link>
                  </Button>
                </>
              )}
            </div>
          )}
        </div>
        {/* The right side of the profile. Should handle scroll itself */}
        <div className='size-full flex-1'>
          <WidgetGrid immutable={!isMine} />
        </div>

        {/* Elements which ignore the layout of this container */}
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
            <div className='fix-modal-layout-shift fixed bottom-0 left-[calc(50%+(var(--sidebar-width)/2))] -translate-x-1/2 -translate-y-6 transform'>
              <ControlBar
                onAddImage={handleAddImage}
                onAddLink={handleAddLink}
                onShare={() => setIsShareDialogOpen(true)}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};
