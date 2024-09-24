import { Meta, StoryObj } from '@storybook/react';

import { WidgetIcon, WidgetTypesWithIcons } from './widget-icon';

const meta: Meta<typeof WidgetIcon> = {
  title: 'WidgetIcon',
  component: WidgetIcon,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    type: {
      control: 'select',
      options: WidgetTypesWithIcons,
    },
  },
};

export default meta;
type Story = StoryObj<typeof WidgetIcon>;

export const Default: Story = {
  args: {
    type: 'Substack',
  },
};

// New story to display all icons in two columns
export const AllIcons: Story = {
  render: () => {
    return (
      <div style={{ display: 'flex', gap: '20px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {WidgetTypesWithIcons.slice(
            0,
            Math.ceil(WidgetTypesWithIcons.length / 2)
          ).map((type) => (
            <div
              key={type}
              style={{ display: 'flex', alignItems: 'center', gap: '10px' }}
            >
              <WidgetIcon type={type} className='m-0' />
              <span
                style={{
                  fontFamily: 'monospace',
                  fontWeight: 'bold',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                {type}
              </span>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {WidgetTypesWithIcons.slice(
            Math.ceil(WidgetTypesWithIcons.length / 2)
          ).map((type) => (
            <div
              key={type}
              style={{ display: 'flex', alignItems: 'center', gap: '10px' }}
            >
              <WidgetIcon type={type} className='m-0' />
              <span
                style={{
                  fontFamily: 'monospace',
                  fontWeight: 'bold',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                {type}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  },
};
