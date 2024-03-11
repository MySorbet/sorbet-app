'use client';

import Link from 'next/link';
import React from 'react';
import { config } from '@/lib/config';

const YOUTUBE_CLIENT_ID = config.youtubeClientId;
// const YOUTUBE_CLIENT_SECRET = config.youtubeClientSecret;
const YOUTUBE_REDIRECT_URL =
  'http://localhost:3000/youtube-oauth'; /* change redirect uri */

const YoutubeButton = (props: any) => {
  return (
    <>
      <div className='m-12 flex justify-center'>
        <Link
          href={`https://accounts.google.com/o/oauth2/v2/auth?client_id=${YOUTUBE_CLIENT_ID}&redirect_uri=${YOUTUBE_REDIRECT_URL}&response_type=token&scope=https://www.googleapis.com/auth/youtube.readonly`}
        >
          <button className='rounded-lg border bg-[#FF0000] p-4 font-semibold text-white hover:opacity-80'>
            Authorize Youtube Widget
          </button>
        </Link>
      </div>
    </>
  );
};

export default YoutubeButton;
