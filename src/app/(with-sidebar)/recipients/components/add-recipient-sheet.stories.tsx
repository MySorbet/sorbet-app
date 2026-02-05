import { useArgs } from '@storybook/preview-api';
import { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';

import { mockBridgeCustomerHandlerKycComplete } from '@/api/bridge/msw-handlers';
import { Button } from '@/components/ui/button';

import { AddRecipientSheet } from './add-recipient-sheet';
import { debugToast } from './story-utils';

const meta = {
  title: 'Recipients/AddRecipientSheet',
  component: AddRecipientSheet,
  parameters: {
    layout: 'centered',
  },
  args: {
    open: true,
    onSubmit: fn(debugToast),
  },
  argTypes: {
    setOpen: {
      table: {
        disable: true,
      },
    },
    onSubmit: {
      table: {
        disable: true,
      },
    },
  },
} satisfies Meta<typeof AddRecipientSheet>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => {
    const [{ open }, setArgs] = useArgs();
    const setOpen = (open: boolean) => setArgs({ open });
    return (
      <>
        <Button variant='sorbet' size='sm' onClick={() => setOpen(true)}>
          Open
        </Button>
        <AddRecipientSheet {...args} open={open} setOpen={setOpen} />
      </>
    );
  },
};

export const Verified: Story = {
  render: Default.render,
  parameters: {
    msw: {
      handlers: [mockBridgeCustomerHandlerKycComplete],
    },
  },
};

export const MobileView: Story = {
  render: (args) => {
    const [{ open }, setArgs] = useArgs();
    const setOpen = (open: boolean) => setArgs({ open });
    return (
      <>
        <Button variant='sorbet' size='sm' onClick={() => setOpen(true)}>
          Open Mobile Sheet
        </Button>
        <AddRecipientSheet {...args} open={open} setOpen={setOpen} />
      </>
    );
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
    layout: 'fullscreen',
  },
};

export const BankRecipientForm: Story = {
  render: (args) => {
    const [{ open }, setArgs] = useArgs();
    const setOpen = (open: boolean) => setArgs({ open });
    return (
      <>
        <div className='bg-muted mb-4 rounded-md p-3 text-sm'>
          <p className='font-medium'>To view Save/Cancel buttons:</p>
          <ol className='mt-2 list-decimal space-y-1 pl-5'>
            <li>Click &quot;Open&quot; button below</li>
            <li>Click &quot;Bank recipient&quot; option</li>
            <li>Scroll to bottom to see Save (purple) and Cancel buttons</li>
          </ol>
        </div>
        <Button variant='sorbet' size='sm' onClick={() => setOpen(true)}>
          Open
        </Button>
        <AddRecipientSheet {...args} open={open} setOpen={setOpen} />
      </>
    );
  },
  parameters: {
    msw: {
      handlers: [mockBridgeCustomerHandlerKycComplete],
    },
  },
};

export const BankRecipientFormMobile: Story = {
  render: BankRecipientForm.render,
  parameters: {
    ...BankRecipientForm.parameters,
    viewport: {
      defaultViewport: 'mobile1',
    },
    layout: 'fullscreen',
    docs: {
      description: {
        story:
          'Mobile view showing the bottom sheet with Save (full-width purple) and Cancel (full-width ghost) buttons stacked vertically.',
      },
    },
  },
};

export const CryptoRecipientForm: Story = {
  render: (args) => {
    const [{ open }, setArgs] = useArgs();
    const setOpen = (open: boolean) => setArgs({ open });
    return (
      <>
        <div className='bg-muted mb-4 rounded-md p-3 text-sm'>
          <p className='font-medium'>To view Save/Cancel buttons:</p>
          <ol className='mt-2 list-decimal space-y-1 pl-5'>
            <li>Click &quot;Open&quot; button below</li>
            <li>Click &quot;Crypto wallet&quot; option</li>
            <li>Scroll to bottom to see Save (purple) and Cancel buttons</li>
          </ol>
        </div>
        <Button variant='sorbet' size='sm' onClick={() => setOpen(true)}>
          Open
        </Button>
        <AddRecipientSheet {...args} open={open} setOpen={setOpen} />
      </>
    );
  },
};

export const CryptoRecipientFormMobile: Story = {
  render: CryptoRecipientForm.render,
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
    layout: 'fullscreen',
    docs: {
      description: {
        story:
          'Mobile view showing the bottom sheet with Save (full-width purple) and Cancel (full-width ghost) buttons stacked vertically.',
      },
    },
  },
};
