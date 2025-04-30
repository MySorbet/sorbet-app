'use client';

import { X } from 'lucide-react';
import * as React from 'react';
import { Drawer as DrawerPrimitive } from 'vaul';

import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

/** Render a vaul drawer as a sheet from the right. This is the default shadcn drawer component with styles tweaked for a side drawer. */
const VaulSheet = ({
  shouldScaleBackground = true,
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Root>) => (
  <DrawerPrimitive.Root
    direction='right'
    shouldScaleBackground={shouldScaleBackground}
    {...props}
  />
);
VaulSheet.displayName = 'VaulSheet';

const VaulSheetTrigger = DrawerPrimitive.Trigger;

const VaulSheetPortal = DrawerPrimitive.Portal;

const VaulSheetClose = DrawerPrimitive.Close;

const VaulSheetOverlay = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DrawerPrimitive.Overlay
    ref={ref}
    className={cn('fixed inset-0 z-50 bg-black/80', className)}
    {...props}
  />
));
VaulSheetOverlay.displayName = DrawerPrimitive.Overlay.displayName;

const VaulSheetContent = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <VaulSheetPortal>
    <VaulSheetOverlay />
    <DrawerPrimitive.Content
      ref={ref}
      className={cn(
        'bg-background fixed inset-y-0 right-0 z-50 h-full w-3/4 max-w-md border-l',
        className
      )}
      {...props}
    >
      <ScrollArea className='size-full'>
        <div className='relative flex flex-col gap-6 p-6'>
          {children}
          <DrawerPrimitive.Close asChild>
            <Button
              variant='ghost'
              size='icon'
              aria-label='Close'
              className={cn(
                'group -mr-1 -mt-1 size-6',
                'ring-offset-background focus-visible:ring-ring absolute right-4 top-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none'
              )}
            >
              <X />
            </Button>
          </DrawerPrimitive.Close>
        </div>
      </ScrollArea>
    </DrawerPrimitive.Content>
  </VaulSheetPortal>
));
VaulSheetContent.displayName = 'VaulSheetContent';

const VaulSheetHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn('grid gap-1.5 text-center sm:text-left', className)}
    {...props}
  />
);
VaulSheetHeader.displayName = 'VaulSheetHeader';

const VaulSheetFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('mt-auto flex flex-col gap-2', className)} {...props} />
);
VaulSheetFooter.displayName = 'VaulSheetFooter';

const VaulSheetTitle = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DrawerPrimitive.Title
    ref={ref}
    className={cn(
      'text-lg font-semibold leading-none tracking-tight',
      className
    )}
    {...props}
  />
));
VaulSheetTitle.displayName = DrawerPrimitive.Title.displayName;

const VaulSheetDescription = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DrawerPrimitive.Description
    ref={ref}
    className={cn('text-muted-foreground text-sm', className)}
    {...props}
  />
));
VaulSheetDescription.displayName = DrawerPrimitive.Description.displayName;

export {
  VaulSheet,
  VaulSheetClose,
  VaulSheetContent,
  VaulSheetDescription,
  VaulSheetFooter,
  VaulSheetHeader,
  VaulSheetOverlay,
  VaulSheetPortal,
  VaulSheetTitle,
  VaulSheetTrigger,
};
