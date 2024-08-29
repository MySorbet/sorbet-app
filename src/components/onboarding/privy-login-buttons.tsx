'use client';

import { Loader2 } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks';

type PressedButton = 'login' | 'signup';

/** Two buttons which launch the Privy login/signup dialog. */
export const PrivyLoginButtons = () => {
  const { login, loading } = useAuth();

  // Track which button was pressed so we can show a loading spinner accordingly.
  const [pressedButton, setPressedButton] = useState<PressedButton>();
  const handleClick = (button: PressedButton) => {
    setPressedButton(button);
    login();
  };
  const loginLoading = loading && pressedButton === 'login';
  const signupLoading = loading && pressedButton === 'signup';

  return (
    <div className='flex gap-4'>
      <Button
        onClick={() => handleClick('signup')}
        disabled={loading}
        className='bg-sorbet'
      >
        {signupLoading && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}{' '}
        Create my Profile
      </Button>
      <Button
        onClick={() => handleClick('login')}
        disabled={loading}
        variant='link'
        className='text-sorbet'
      >
        {loginLoading && <Loader2 className='mr-2 h-4 w-4 animate-spin' />} Log
        in
      </Button>
    </div>
  );
};
