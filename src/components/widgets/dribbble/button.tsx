'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';

const DRIBBLE_CLIENT_ID = process.env.NEXT_PUBLIC_DRIBBLE_CLIENT_ID;
const DRIBBLE_CLIENT_SECRET = process.env.NEXT_PUBLIC_DRIBBLE_CLIENT_SECRET;

const DribbleOauthButton = (props: any) => {
  return (
    <a
      className='dribbleEditProfileFormBtn'
      href={`https://dribbble.com/oauth/authorize?client_id=${DRIBBLE_CLIENT_ID}`}
    >
      Dribble
    </a>
  );
};

export default DribbleOauthButton;
