import { Meta, StoryObj } from '@storybook/react';

import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

import {
  VaulSheet,
  VaulSheetClose,
  VaulSheetContent,
  VaulSheetDescription,
  VaulSheetFooter,
  VaulSheetHeader,
  VaulSheetTitle,
  VaulSheetTrigger,
} from './vaul-sheet';

const meta = {
  title: 'VaulSheet',
  component: VaulSheet,
  parameters: {
    layout: 'centered',
  },
  render: (args) => (
    <VaulSheet {...args}>
      <VaulSheetTrigger>
        <Button>Open</Button>
      </VaulSheetTrigger>
      <VaulSheetContent direction={args.direction}>
        <VaulSheetHeader>
          <VaulSheetTitle>Hello</VaulSheetTitle>
          <VaulSheetDescription>This is a description</VaulSheetDescription>
        </VaulSheetHeader>
        <ScrollArea className='overflow-y-auto'>
          <div className='flex size-full flex-col gap-3'>
            {new Array(30).fill(0).map((_, index) => (
              <div key={index} className='bg-muted h-10 w-full'>
                {index}
              </div>
            ))}
          </div>
        </ScrollArea>
        <VaulSheetFooter>
          <VaulSheetClose>
            <Button>Close</Button>
          </VaulSheetClose>
        </VaulSheetFooter>
      </VaulSheetContent>
    </VaulSheet>
  ),
} satisfies Meta<typeof VaulSheet>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Bottom: Story = {
  args: {
    direction: 'bottom',
  },
};
