import { CreditCardDialog } from './credit-card-dialog';
import './styles.css';
import { Button } from '@/components/ui/button';
import { Edit, Plus } from 'lucide-react';
import React, { useState } from 'react';
import Cards from 'react-credit-cards';
import type { Focused } from 'react-credit-cards';

export const CreditCardForm = () => {
  const [isCardAdded, setIsCardAdded] = useState(false);
  const [focus, setFocus] = useState<Focused | undefined>(undefined);
  const [cardData, setCardData] = useState({
    cardName: '',
    cardNumber: '',
    expiry: '',
    cvc: '',
    zipCode: '',
  });

  const handleInputFocus = (e: any) => {
    const allowedFocusFields = [
      'cardNumber',
      'cardName',
      'expiry',
      'cvc',
      'zipCode',
    ];
    const focusValue = e.target.name;
    if (allowedFocusFields.includes(focusValue)) {
      setFocus(focusValue);
    } else {
      console.error(`Invalid focus field: ${focusValue}`);
      setFocus(undefined);
    }
  };

  const handleDialogSubmit = (data: any) => {
    setCardData(data);
    setIsCardAdded(false);
  };

  return (
    <>
      <div className='shadow-[0px_10px_30px_0px_#00000014] credit-card-form bg-white rounded-3xl px-4 py-8 lg:p-12 flex flex-col gap-8'>
        <div className=''>
          <Cards
            number={cardData.cardNumber}
            name={cardData.cardName}
            issuer={undefined}
            expiry={cardData.expiry}
            cvc={cardData.cvc}
            focused={focus}
          />
        </div>
        <Button
          className={`gap-1 ${
            !cardData.cardNumber && 'bg-sorbet'
          } hover:brightness-125`}
          onClick={() => setIsCardAdded(true)}
          variant={cardData.cardNumber ? 'outline' : 'default'}
        >
          {cardData.cardNumber ? <Edit size={18} /> : <Plus size={18} />}{' '}
          {cardData.cardNumber ? 'Edit Card' : 'Add Card'}
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
