import * as React from 'react';

import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useIsMobile } from '@/hooks/use-mobile';

interface TooltipOrDrawerContextValue {
  isMobile: boolean;
}

const TooltipOrDrawerContext = React.createContext<
  TooltipOrDrawerContextValue | undefined
>(undefined);

function useTooltipOrDrawerContext() {
  const context = React.useContext(TooltipOrDrawerContext);
  if (!context) {
    throw new Error(
      'TooltipOrDrawer subcomponents must be used within TooltipOrDrawer'
    );
  }
  return context;
}

type TooltipOrDrawerContentProps = React.PropsWithChildren<{
  tooltipContentProps?: React.ComponentPropsWithoutRef<typeof TooltipContent>;
  drawerContentProps?: React.ComponentPropsWithoutRef<typeof DrawerContent>;
}>;

/**
 * Render a tooltip on desktop and a drawer on mobile. Similar to Credenza.
 * TODO: Share this the rest of the app?
 */
export const TooltipOrDrawer = ({
  children,
  ...props
}: React.PropsWithChildren<object>) => {
  const isMobile = useIsMobile();
  const Root = isMobile ? Drawer : Tooltip;
  return (
    <TooltipOrDrawerContext.Provider value={{ isMobile }}>
      <Root {...props}>{children}</Root>
    </TooltipOrDrawerContext.Provider>
  );
};

export const TooltipOrDrawerTrigger = React.forwardRef<
  React.ElementRef<typeof DrawerTrigger>,
  React.ComponentPropsWithoutRef<typeof DrawerTrigger> & { asChild?: boolean }
>(({ asChild, children, ...props }, ref) => {
  const { isMobile } = useTooltipOrDrawerContext();
  const Trigger = isMobile ? DrawerTrigger : TooltipTrigger;
  return (
    <Trigger ref={ref} asChild={asChild} {...props}>
      {children}
    </Trigger>
  );
});
TooltipOrDrawerTrigger.displayName = 'TooltipOrDrawerTrigger';

export const TooltipOrDrawerContent = React.forwardRef<
  React.ElementRef<typeof DrawerContent>,
  TooltipOrDrawerContentProps
>(({ children, tooltipContentProps, drawerContentProps }, ref) => {
  const { isMobile } = useTooltipOrDrawerContext();
  if (isMobile) {
    return (
      <DrawerContent ref={ref} {...(drawerContentProps ?? {})}>
        {children}
      </DrawerContent>
    );
  }
  return (
    <TooltipContent ref={ref} {...(tooltipContentProps ?? {})}>
      {children}
    </TooltipContent>
  );
});
TooltipOrDrawerContent.displayName = 'TooltipOrDrawerContent';
