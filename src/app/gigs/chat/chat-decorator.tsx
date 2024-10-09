import { ReactRenderer } from '@storybook/react';
import { DecoratorFunction } from 'storybook/internal/types';

import Providers from '@/app/providers';

export const ChatDecorator: DecoratorFunction<ReactRenderer, unknown> = (
  Story
) => {
  return (
    <Providers>
      <Story />
    </Providers>
  );
};

