import Image from 'next/image';

interface CreditCardPreviewProps {
  cvc: string | number;
  expiry: string | number;
  issuer?: string | undefined;
  locale?: { valid: string } | undefined;
  name: string;
  number: string | number;
}

import './styles.css';

export const CreditCardPreview: React.FC<CreditCardPreviewProps> = ({
  cvc,
  expiry,
  issuer,
  locale,
  name,
  number,
}) => {
  return (
    <div className='min-w-[360px] rounded-2xl bg-white px-6 py-10 shadow-[0_16px_50px_0px_rgba(0,0,0,0.15)]'>
      <div className='mb-10 h-8 w-16 rounded-lg bg-[#F2F2F2]'></div>
      <Image
        height={9}
        width={255}
        src='/svg/credit-card-dots.svg'
        alt='grey-dots'
      ></Image>
      <div className='mt-10 flex justify-between'>
        <div className='text-[#D7D7D7]'>
          <div>CARD HOLDER</div>
          <div className='text-xl'>{name || '**********'}</div>
        </div>
        <div className='text-right text-[#D7D7D7]'>
          <div>EXPIRES</div>
          <div className='text-xl'>{expiry || 'XX/XX'}</div>
        </div>
      </div>
    </div>
  );
};
