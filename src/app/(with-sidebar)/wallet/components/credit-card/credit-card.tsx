import './styles.css';

import React, { useState } from 'react';

import { Button } from '@/components/ui/button';

import { CreditCardDialog } from './credit-card-dialog';
import { CreditCardPreview } from './credit-card-preview';

interface CardData {
  cardName: string;
  cardNumber: string;
  expiry: string;
  cvc: string;
  zipCode: string;
}

export const CreditCardForm = () => {
  const [isCardAdded, setIsCardAdded] = useState(false);
  const [cardData, setCardData] = useState<CardData>({
    cardName: '',
    cardNumber: '',
    expiry: '',
    cvc: '',
    zipCode: '',
  });

  // const handleInputFocus = (e: React.FocusEvent<HTMLInputElement>) => {
  //   const allowedFocusFields = [
  //     'cardNumber',
  //     'cardName',
  //     'expiry',
  //     'cvc',
  //     'zipCode',
  //   ];
  //   const focusValue = e.target.name;
  //   if (allowedFocusFields.includes(focusValue)) {
  //     setFocus(focusValue as Focused);
  //   } else {
  //     console.error(`Invalid focus field: ${focusValue}`);
  //     setFocus(undefined);
  //   }
  // };

  const handleDialogSubmit = (data: CardData) => {
    setCardData(data);
    setIsCardAdded(false);
  };

  return (
    <>
      <div className='credit-card-form flex flex-col items-center gap-8 rounded-3xl bg-white px-4 py-8 shadow-[0px_10px_30px_0px_#00000014] lg:p-12'>
        <div className=''>
          <CreditCardPreview
            number={cardData.cardNumber}
            name={cardData.cardName}
            expiry={cardData.expiry}
            cvc={cardData.cvc}
          />
        </div>
        <Button
          className={`gap-1 ${
            !cardData.cardNumber && 'bg-sorbet'
          } hover:brightness-125`}
          onClick={() => setIsCardAdded(true)}
          variant={cardData.cardNumber ? 'outline' : 'default'}
          disabled
        >
          {/* {cardData.cardNumber ? <Edit size={18} /> : <Plus size={18} />}{' '}
          {cardData.cardNumber ? 'Edit Card' : 'Add Card'} */}
          Coming soon
        </Button>
      </div>

      {isCardAdded && (
        <CreditCardDialog
          isOpen={isCardAdded}
          onClose={() => setIsCardAdded(false)}
          onSubmit={handleDialogSubmit}
          initialState={cardData}
        />
      )}
    </>
  );
};
