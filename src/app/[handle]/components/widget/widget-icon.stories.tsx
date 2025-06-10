import { Meta, StoryObj } from '@storybook/react';

import { UrlTypes } from '../../util';
import { SocialIcon } from './social-icon';

const meta = {
  title: 'Profile/WidgetIcon',
  component: SocialIcon,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    type: {
      control: 'select',
      options: UrlTypes,
    },
  },
} satisfies Meta<typeof SocialIcon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    type: 'Substack',
  },
};

// New story to display all icons in two columns
export const AllIcons: Story = {
  args: {
    type: 'Substack', // ignored in render
  },
  render: () => {
    return (
      <div style={{ display: 'flex', gap: '20px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {UrlTypes.slice(0, Math.ceil(UrlTypes.length / 2)).map((type) => (
            <div
              key={type}
              style={{ display: 'flex', alignItems: 'center', gap: '10px' }}
            >
              <SocialIcon type={type} className='m-0' />
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
          {UrlTypes.slice(Math.ceil(UrlTypes.length / 2)).map((type) => (
            <div
              key={type}
              style={{ display: 'flex', alignItems: 'center', gap: '10px' }}
            >
              <SocialIcon type={type} className='m-0' />
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
