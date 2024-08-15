import Twitter from '@/../public/images/social/twitter.png';
import Image from "next/image";

export const TwitterIcon = () => {
  return (
    <Image
    src={Twitter}
    height={52}
    width={52}
    alt='Twiiter logo'
  />
  )
}