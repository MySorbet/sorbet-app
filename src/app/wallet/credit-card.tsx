import './styles.css';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus } from 'lucide-react';
import React, { useState } from 'react';
import Cards from 'react-credit-cards';
import type { Focused } from 'react-credit-cards';

const CreditCardForm = () => {
  const [isCardAdded, setIsCardAdded] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  const [focus, setFocus] = useState<Focused | undefined>(undefined);

  const handleInputFocus = (e: any) => {
    const allowedFocusFields = ['number', 'name', 'expiry', 'cvc'];
    const focusValue = e.target.name;
    if (allowedFocusFields.includes(focusValue)) {
      setFocus(focusValue);
    } else {
      console.error(`Invalid focus field: ${focusValue}`);
      setFocus(undefined);
    }
  };

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    switch (name) {
      case 'cardNumber':
        setCardNumber(value);
        break;
      case 'cardName':
        setCardName(value);
        break;
      case 'expiry':
        setExpiry(value);
        break;
      case 'cvc':
        setCvc(value);
        break;
      default:
        break;
    }
  };

  return (
    <div className='credit-card-form bg-white rounded-xl p-12 flex flex-col gap-8'>
      <div className='text-center text-xl'>Credit Card</div>
      <div className=''>
        <Cards
          number={cardNumber}
          name={cardName}
          issuer={undefined}
          expiry={expiry}
          cvc={cvc}
          focused={focus}
        />
      </div>
      {!isCardAdded ? (
        <Button
          className='gap-1 bg-sorbet'
          onClick={() => setIsCardAdded(true)}
        >
          <Plus size={18} /> Add Card
        </Button>
      ) : (
        <div className='w-full'>
          <form>
            <div className='flex flex-col gap-2 mb-4'>
              <label className='text-sm text-gray-700'>Full Name</label>
              <Input
                type='text'
                name='cardName'
                placeholder='Full Name'
                onChange={handleInputChange}
                onFocus={handleInputFocus}
              />
            </div>
            <div className='flex flex-col gap-2 mb-4'>
              <label className='text-sm text-gray-700'>Card Number</label>
              <Input
                type='tel'
                name='cardNumber'
                placeholder='****-****-****-****'
                onChange={(e) => {
                  let value = e.target.value
                    .replace(/\D/g, '')
                    .substring(0, 16);
                  const formattedValue = value
                    ? value.match(/.{1,4}/g)?.join('-') ?? ''
                    : '';
                  e.target.value = value; // Keep the actual value without hyphens for processing
                  handleInputChange(e);
                  e.target.value = formattedValue; // Display value with hyphens for user
                }}
                onFocus={handleInputFocus}
                pattern='\d{4}-\d{4}-\d{4}-\d{4}'
                maxLength={19}
              />
            </div>
            <div className='flex flex-row gap-2 mb-4'>
              <div className='flex flex-col gap-2'>
                <label className='text-sm text-gray-700'>Exp Date</label>
                <Input
                  type='text'
                  name='expiry'
                  placeholder='MM/DD'
                  onChange={(e) => {
                    let value = e.target.value;
                    const regex = /^(0[1-9]|1[0-2])\/([0-9]{2})$/;
                    // Automatically add slash after MM
                    if (value.length === 2 && !value.includes('/')) {
                      value = value + '/';
                      e.target.value = value;
                    }
                    if (regex.test(value) || value === '') {
                      handleInputChange(e);
                    }
                  }}
                  onFocus={handleInputFocus}
                  maxLength={5}
                />
              </div>
              <div className='flex flex-col gap-2'>
                <label className='text-sm text-gray-700'>CVC</label>
                <Input
                  type='text'
                  name='cvc'
                  placeholder='CVC'
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '').slice(0, 3);
                    e.target.value = value;
                    handleInputChange(e);
                  }}
                  onFocus={handleInputFocus}
                  maxLength={3}
                />
              </div>
            </div>
            <div className='flex flex-col gap-2 mb-4'>
              <label className='text-sm text-gray-700'>Zip Code</label>
              <Input
                type='text'
                name='zipCode'
                placeholder='Zipcode'
                onChange={handleInputChange}
                onFocus={handleInputFocus}
              />
            </div>
          </form>
          <Button
            className='bg-sorbet w-full'
            onClick={() => setIsCardAdded(false)}
          >
            Save Card
          </Button>
        </div>
      )}
    </div>
  );
};

export default CreditCardForm;
