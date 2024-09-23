import { Meta } from '@storybook/react';
import SkillInput from '@/components/syntax-ui/skill-input';
import { userEvent, within } from '@storybook/testing-library';

const meta = {
  component: SkillInput,
  parameters: { layout: 'centered' },
  args: {
    initialSkills: [],
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

export const MaxSkills = {
  args: {
    initialSkills: ['Skill 1', 'Skill 2', 'Skill 3', 'Skill 4', 'Skill 5'],
  },
};

export const MaxCharacters = {
  play: async ({ canvasElement }: { canvasElement: HTMLInputElement }) => {
    const canvas = within(canvasElement);

    const skillInput = await canvas.findByRole('textbox');
    const longInput = 'This is a long skill!';
    await userEvent.type(skillInput, longInput, { delay: 100 });
  },
};
