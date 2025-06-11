import { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';

import { Button } from '@/components/ui/button';

import { useContainerQuery } from './use-container-query';

const ContainerQueryDemo = () => {
  const { ref, matches: isLargeEnough } =
    useContainerQuery<HTMLDivElement>('20rem');

  return (
    <div className='flex flex-col gap-4'>
      <div className='text-sm'>
        Resize the container below to see the hook in action.
        <br />
        Current state:{' '}
        {isLargeEnough
          ? 'Container is at least 20rem wide'
          : 'Container is less than 20rem wide'}
      </div>

      <div
        ref={ref}
        className='max-w-full resize-x overflow-auto border border-dashed p-4'
        style={{ width: '300px', minWidth: '100px' }}
      >
        <div className='flex gap-2'>
          <Button
            variant={isLargeEnough ? 'default' : 'outline'}
            onClick={fn()}
          >
            Action 1
          </Button>
          {isLargeEnough && (
            <Button variant='outline' onClick={fn()}>
              Action 2
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

const meta = {
  title: 'Hooks/useContainerQuery',
  component: ContainerQueryDemo,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof ContainerQueryDemo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
