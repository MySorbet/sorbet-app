import { useArgs } from '@storybook/preview-api';
import { Meta } from '@storybook/react';
import { NuqsTestingAdapter } from 'nuqs/adapters/testing';

import { OpenOnDesktopDrawer } from './open-on-desktop-drawer';

const meta = {
  title: 'Components/common/OpenOnDesktopDrawer',
  component: OpenOnDesktopDrawer,
  args: {
    open: true,
  },
  argTypes: {
    open: {
      control: 'boolean',
    },
  },
} satisfies Meta<typeof OpenOnDesktopDrawer>;

export default meta;

// Not a typical `Story` type story, because we are doing something fancy with controls and query state
export const Default = () => {
  const [{ open }, updateArgs] = useArgs();
  return (
    // Clever way of syncing storybook boolean arg with query state
    <NuqsTestingAdapter
      searchParams={{ 'desktop-drawer-open': open }}
      onUrlUpdate={(e) =>
        updateArgs({
          open: e.searchParams.get('desktop-drawer-open') === 'true',
        })
      }
    >
      <OpenOnDesktopDrawer />
    </NuqsTestingAdapter>
  );
};
