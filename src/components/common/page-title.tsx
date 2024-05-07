import { NextSeo } from 'next-seo';
import React from 'react';

interface PageTitleProps {
  title: string;
}

export const PageTitle: React.FC<PageTitleProps> = ({ title }) => {
  return (
    <NextSeo
      title={`Sorbet | ${title}`}
      description='The all-in-one solution for your freelance work, powered by blockchain.'
    />
  );
};
