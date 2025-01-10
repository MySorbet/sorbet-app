import { Button } from '@/components/ui/button';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';

interface OpenOnDesktopDrawerProps {
  /** Is the drawer is open */
  open?: boolean;
  /** Callback for when the drawer is closed */
  onClose?: () => void;
}

/** Simple drawer notifying the user to open sorbet on desktop */
export const OpenOnDesktopDrawer = ({
  open,
  onClose,
}: OpenOnDesktopDrawerProps) => {
  return (
    <Drawer open={open} onClose={onClose}>
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
