import { ReactRenderer } from '@storybook/react';
import { useState } from 'react';
import { DecoratorFunction } from 'storybook/internal/types';

import { initialUserSignUp, UserSignUp, UserSignUpContext } from './signup';

/**
 * A decorator which mocks the UserSignUpContext Provider.
 * It is used to render components which require UserSignUpContext.
 */
export const UserSignUpDecorator: DecoratorFunction<ReactRenderer, unknown> = (
  Story
) => {
  const [userData, setUserData] = useState<UserSignUp>(initialUserSignUp);
  const [step, setStep] = useState<number>(0);
  return (
    <UserSignUpContext.Provider
      value={{ userData, setUserData, step, setStep }}
    >
      <Story />
    </UserSignUpContext.Provider>
  );
};
