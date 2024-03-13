'use client';

import Link from 'next/link';
import React from 'react';
import { config } from '@/lib/config';

// Instagram Oauth
// const INSTAGRAM_APP_ID = config.instagramBasicDisplayAppId;
// const INSTAGRAM_APP_SECRET = config.instagramAppSecret;
// const INSTAGRAM_CLIENT_TOKEN = config.instagramClientToken;
// Basic Display
const INSTAGRAM_BASIC_DISPLAY_APP_ID = config.instagramBasicDisplayAppId;
// const INSTAGRAM_BASIC_DISPLAY_APP_SECRET =
//   config.instagramBasicDisplayAppSecret;
const INSTAGRAM_REDIRECT_URL = 'https://www-five-lac.vercel.app/';
// const INSTAGRAM_REDIRECT_URL = 'https://www-five-lac.vercel.app/profile'
// const INSTAGRAM_REDIRECT_URL = 'http://localhost:3000/instagram-oauth'

const SpotifyButton = (props: any) => {
  return (
    <>
      <div className='m-12 flex justify-center'>
        <Link
          href={`https://api.instagram.com/oauth/authorize?client_id=${INSTAGRAM_BASIC_DISPLAY_APP_ID}&redirect_uri=${INSTAGRAM_REDIRECT_URL}&response_type=code&scope=user_profile,user_media`}
        >
          <button
            className='rounded-lg border p-4 font-semibold text-white hover:opacity-80'
            style={{
              backgroundImage:
                'linear-gradient(to top right, #feda75, #fa7e1e, #d62976, #962fbf, #4f5bd5',
            }}
          >
            Authorize Instagram Widget
          </button>
        </Link>
      </div>
    </>
  );
};

export default SpotifyButton;
