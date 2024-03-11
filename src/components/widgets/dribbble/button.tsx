'use client';

import React from 'react';
import { config } from '@/lib/config';

const DribbleOauthButton = (props: any) => {
  return (
    <a
      className='dribbleEditProfileFormBtn'
      href={`https://dribbble.com/oauth/authorize?client_id=${config.dribbleClientId}`}
    >
      Dribble
    </a>
  );
};

export default DribbleOauthButton;
