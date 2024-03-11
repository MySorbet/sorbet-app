'use client';

import React from 'react';
import { config } from '@/lib/config';

const GithubOauthButton = () => {
  return (
    <>
      <div className='m-12 flex justify-center'>
        <a
          className='rounded-lg border bg-black p-4 font-semibold text-white hover:opacity-80'
          href={`https://github.com/login/oauth/authorize?client_id=${config.githubClientId}`}
        >
          Create Github Widget
        </a>
      </div>
    </>
  );
};

export default GithubOauthButton;
