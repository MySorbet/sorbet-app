import { zodResolver } from '@hookform/resolvers/zod';
import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

import {
  SocialHandleInput,
  SocialHandleInputWidgetTypes,
} from './social-handle-input';

const meta: Meta<typeof SocialHandleInput> = {
  component: SocialHandleInput,
  title: 'Profile/deprecated/SocialHandleInput',
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    type: {
      options: SocialHandleInputWidgetTypes,
      control: {
        type: 'select',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof SocialHandleInput>;

export const Default: Story = {
  args: {
    type: 'Behance',
  },
};

export const Controlled: Story = {
  render: (args) => {
    const [value, setValue] = useState('');

    return (
      <SocialHandleInput
        {...args}
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    );
  },
  args: {
    type: 'Behance',
  },
};

export const ControlledWithRHF: Story = {
  render: (args) => {
    const formSchema = z.object({
      handle: z.string(),
    });

    const form = useForm({
      resolver: zodResolver(formSchema),
      defaultValues: {
        handle: '',
      },
    });

    return (
      <Form {...form}>
        <form
          // @ts-expect-error complains about onSubmit being undefined and wrong type but works
          onSubmit={form.handleSubmit(args.onSubmit)}
          className='flex items-end gap-4'
        >
          <FormField
            control={form.control}
            name='handle'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Controlled by form</FormLabel>
                <FormControl>
                  <SocialHandleInput {...args} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type='submit'>Submit</Button>
        </form>
      </Form>
    );
  },
  args: {
    type: 'Behance',
    onSubmit: fn(),
  },
};
