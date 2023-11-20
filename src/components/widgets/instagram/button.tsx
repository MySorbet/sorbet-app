'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';

// Instagram Oauth
const INSTAGRAM_APP_ID = process.env.NEXT_PUBLIC_INSTAGRAM_APP_ID;
const INSTAGRAM_APP_SECRET = process.env.NEXT_PUBLIC_INSTAGRAM_APP_SECRET;
const INSTAGRAM_CLIENT_TOKEN = process.env.NEXT_PUBLIC_INSTAGRAM_CLIENT_TOKEN;
// Basic Display
const INSTAGRAM_BASIC_DISPLAY_APP_ID =
  process.env.NEXT_PUBLIC_INSTAGRAM_BASIC_DISPLAY_APP_ID;
const INSTAGRAM_BASIC_DISPLAY_APP_SECRET =
  process.env.NEXT_PUBLIC_INSTAGRAM_BASIC_DISPLAY_APP_SECRET;
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
