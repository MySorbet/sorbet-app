import { Meta } from '@storybook/react';
import SkillInput from '@/components/syntax-ui/skill-input';

const meta = {
  component: SkillInput,
  parameters: { layout: 'centered' },
  args: {
    initialSkills: ['test'],
  },
  decorators: [
    (Story) => {
      return (
        <div className='flex w-[400px] flex-col gap-6 rounded-3xl bg-[#F9F7FF] p-6 shadow-lg'>
          <Story />
        </div>
      );
    },
  ],
} satisfies Meta<typeof SkillInput>;

export default meta;

export const Default = {};
