import { useCallback,useState } from 'react';

import {
  SocialHandleInputWidgetType,
  typeAndHandleToWidgetUrl,
} from '@/components/profile/widgets/onboarding-drawer';

interface UseOnboardingDrawerProps {
  handleAddMultipleWidgets: (urls: string[]) => Promise<void>;
}

export const useOnboardingDrawer = ({
  handleAddMultipleWidgets,
}: UseOnboardingDrawerProps) => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleOnboardingDrawerSubmit = useCallback(
    async (handles: Partial<Record<SocialHandleInputWidgetType, string>>) => {
      const urls = Object.entries(handles).map(([type, handle]) => {
        return typeAndHandleToWidgetUrl(
          type as SocialHandleInputWidgetType,
          handle
        );
      });
      await handleAddMultipleWidgets(urls);
      setDrawerOpen(false);
    },
    [handleAddMultipleWidgets]
  );

  return {
    drawerOpen,
    setDrawerOpen,
    handleOnboardingDrawerSubmit,
  };
};
