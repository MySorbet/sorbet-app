'use client';

import Link from 'next/link';
import React from 'react';
import { config } from '@/lib/config';

const SPOTFIY_CLIENT_ID = config.spotifyClientId;
// const SPOFIFY_CLIENT_SECRET = config.spotifyClientSecret;
const SPOTIFY_REDIRECT_URL =
  'http://localhost:3000/spotify-oauth'; /* change redirect_uri */

const SpotifyButton = (props: any) => {
  return (
    <>
      <div className='m-12 flex justify-center'>
        <Link
          href={`https://accounts.spotify.com/authorize?client_id=${SPOTFIY_CLIENT_ID}&response_type=code&redirect_uri=${SPOTIFY_REDIRECT_URL}`}
        >
          <button className='rounded-lg border bg-[#66D58F] p-4 font-semibold text-white hover:opacity-80'>
            Authorize Spotify Widget
          </button>
        </Link>
      </div>
    </>
  );
};

export default SpotifyButton;
