import { Meta, StoryObj } from '@storybook/react';

import { Glyph, glyphs } from './glyph';

const meta = {
  title: 'Glyph',
  component: Glyph,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof Glyph>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const All: Story = {
  render: () => {
    return (
      <div className='flex flex-wrap gap-4'>
        {Object.keys(glyphs).map((type) => (
          <Glyph key={type} type={type} />
        ))}
      </div>
    );
  },
};
