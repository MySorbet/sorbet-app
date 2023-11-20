'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';

const SPOTFIY_CLIENT_ID = process.env.NEXT_PUBLIC_SPOTIFY_WIDGET_CLIENT_ID;
const SPOFIFY_CLIENT_SECRET =
  process.env.NEXT_PUBLIC_SPOTIFY_WIDGET_CLIENT_SECRET;
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
