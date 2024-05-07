import { NextSeo } from 'next-seo';
import React from 'react';

interface SocialMetaProps {
  title: string;
  description?: string;
  image?: string;
}

export const UserSocialPreview: React.FC<SocialMetaProps> = ({
  title,
  description = 'The all-in-one solution for your freelance work, powered by blockchain.',
  image = 'http://framerusercontent.com/images/oIBwaUw8Is43oxKK9ekodxxA.png',
}) => {
  return (
    <NextSeo
      title={`Sorbet | ${title}`}
      description={description}
      openGraph={{
        title: `Sorbet | ${title}`,
        description:
          'The all-in-one solution for your freelance work, powered by blockchain.',
        siteName: `Sorbet | ${title}`,
        images: [
          {
            url: image,
            alt: `Sorbet | ${title}`,
            type: 'image/png',
            width: 1200,
            height: 600,
          },
        ],
      }}
    />
  );
};
