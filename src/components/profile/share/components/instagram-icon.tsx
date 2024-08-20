import Image from 'next/image';

import Instagram from '@/../public/images/social/instagram.png';

export const InstagramIcon = () => {
  return (
    <Image
      src={Instagram}
      height={52}
      width={52}
      alt='Instagram logo'
    />
  )
}