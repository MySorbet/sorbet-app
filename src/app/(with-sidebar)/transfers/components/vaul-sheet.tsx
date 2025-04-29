'use client';

import * as React from 'react';
import { Drawer as DrawerPrimitive } from 'vaul';

import { cn } from '@/lib/utils';

/** Render a vaul drawer as a sheet from the right. This is the default shadcn drawer component with styles tweaked for a side drawer. */
const VaulSheet = ({
  shouldScaleBackground = true,
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Root>) => (
  <DrawerPrimitive.Root
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
        'bg-background fixed inset-y-0 right-0 z-50 flex h-auto flex-col gap-6 rounded-l-[10px] border p-6',
        className
      )}
      {...props}
    >
      {children}
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
