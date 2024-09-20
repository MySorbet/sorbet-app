import Image from 'next/image';

import Twitter from '~/images/social/twitter.svg';

export const TwitterIcon = () => {
  return <Image src={Twitter} height={52} width={52} alt='Twitter logo' />;
};
