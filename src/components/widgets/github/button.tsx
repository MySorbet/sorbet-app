'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';

const GITHUB_CLIENT_ID = process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID;
const GITHUB_CLIENT_SECRET = process.env.NEXT_PUBLIC_GITHUB_CLIENT_SECRET;

const GithubOauthButton = () => {
  return (
    <>
      <div className='m-12 flex justify-center'>
        <a
          className='rounded-lg border bg-black p-4 font-semibold text-white hover:opacity-80'
          href={`https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}`}
        >
          Create Github Widget
        </a>
      </div>
    </>
  );
};

export default GithubOauthButton;
