import Image from 'next/image';

import Instagram from '~/images/social/instagram.svg';

export const InstagramIcon = () => {
  return <Image src={Instagram} height={52} width={52} alt='Instagram logo' />;
};
