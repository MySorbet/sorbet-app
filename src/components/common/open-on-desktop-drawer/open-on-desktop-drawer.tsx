import { parseAsBoolean, useQueryState } from 'nuqs';

import { Button } from '@/components/ui/button';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';

/**
 * Simple drawer notifying the user to open sorbet on desktop.
 *
 * The open state is managed via the url query state.
 * Use with `useOpenOnDesktopDrawer` to manage the open state.
 *
 * @example
 * ```tsx
 * const [, setOpen] = useOpenOnDesktopDrawer();
 * handleClick = () => setOpen(true);
 * ```
 */
export const OpenOnDesktopDrawer = () => {
  const [open, setOpen] = useOpenOnDesktopDrawer();

  return (
    <Drawer open={open} onClose={() => setOpen(false)}>
      <DrawerContent aria-describedby={undefined}>
        <DrawerHeader className='pb-1'>
          <DrawerTitle className='text-center text-lg font-semibold'>
            Switch to desktop
          </DrawerTitle>
        </DrawerHeader>

        <p className='text-muted-foreground px-4 text-center text-sm'>
          This feature is only available on desktop. Switch to your computer to
          explore it fully.
        </p>

        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant='sorbet'>Got it!</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

/** Hook to manage the open state of the drawer via the url */
export const useOpenOnDesktopDrawer = () => {
  return useQueryState<boolean>(
    'desktop-drawer-open',
    parseAsBoolean.withDefault(false)
  );
};
