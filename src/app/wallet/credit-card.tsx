import './styles.css';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus } from 'lucide-react';
import React, { useState } from 'react';
import Cards from 'react-credit-cards';
import type { Focused } from 'react-credit-cards';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';

const schema = z.object({
  cardName: z.string().min(1, { message: 'Name is required' }),
  cardNumber: z
    .string()
    .length(16, { message: 'Card number must be 16 digits' })
    .regex(/^\d{16}$/, {
      message: 'Card number is not valid',
    }),
  expiry: z.string().regex(/^(0[1-9]|1[0-2])([0-9]{2})$/, {
    message: 'Expiry date is not valid',
  }),
  cvc: z.string().length(3, { message: 'CVC must be 3 digits' }),
  zipCode: z.string().min(1, { message: 'Zip Code is required' }),
});

export const CreditCardForm = () => {
  const [isCardAdded, setIsCardAdded] = useState(false);
  const [focus, setFocus] = useState<Focused | undefined>(undefined);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
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

  const onSubmit = (data: any) => {
    console.log(data);
    setIsCardAdded(false);
  };

  return (
    <div className='shadow-sm border border-2 border-gray-200 credit-card-form bg-white rounded-xl px-4 py-8 lg:p-12 flex flex-col gap-8'>
      <div className='text-center text-xl'>Credit Card</div>
      <div className=''>
        <Cards
          number={control._formValues.cardNumber || ''}
          name={control._formValues.cardName || ''}
          issuer={undefined}
          expiry={control._formValues.expiry || ''}
          cvc={control._formValues.cvc || ''}
          focused={focus}
        />
      </div>
      {!isCardAdded ? (
        <Button
          className='gap-1 bg-sorbet hover:bg-sorbet hover:brightness-125'
          onClick={() => setIsCardAdded(true)}
        >
          <Plus size={18} /> Add Card
        </Button>
      ) : (
        <div className='w-full h-full'>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className='flex flex-col gap-2 mb-4'>
              <label className='text-sm text-gray-700'>Full Name</label>
              <Controller
                name='cardName'
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    type='text'
                    placeholder='Full Name'
                    onFocus={handleInputFocus}
                    className={errors.cardName ? 'border-red-500' : ''}
                  />
                )}
              />
              {errors.cardName &&
                typeof errors.cardName.message === 'string' && (
                  <p className='text-red-500 text-xs'>
                    {errors.cardName.message}
                  </p>
                )}{' '}
            </div>
            <div className='flex flex-col gap-2 mb-4'>
              <label className='text-sm text-gray-700'>Card Number</label>
              <Controller
                name='cardNumber'
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    value={
                      field.value &&
                      field.value
                        .replace(/\D/g, '')
                        .replace(/(\d{4})(?=\d)/g, '$1-')
                    }
                    onChange={(e) =>
                      field.onChange(
                        e.target.value
                          .replace(/\D/g, '')
                          .replace(/(\d{4})(?=\d)/g, '$1')
                      )
                    }
                    type='tel'
                    placeholder='****-****-****-****'
                    maxLength={19}
                    onFocus={handleInputFocus}
                    className={errors.cardNumber ? 'border-red-500' : ''}
                  />
                )}
              />
              {errors.cardNumber &&
                typeof errors.cardNumber.message === 'string' && (
                  <p className='text-red-500 text-xs'>
                    {errors.cardNumber.message}
                  </p>
                )}
            </div>
            <div className='flex flex-row gap-2 mb-4'>
              <div className='flex flex-col gap-2'>
                <label className='text-sm text-gray-700'>Exp Date</label>
                <Controller
                  name='expiry'
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      value={
                        field.value &&
                        field.value
                          .replace(/\D/g, '')
                          .replace(/^(1[0-2]|0[1-9])([0-3][0-9])$/, '$1/$2')
                          .substring(0, 5)
                      }
                      onChange={(e) =>
                        field.onChange(
                          e.target.value
                            .replace(/\D/g, '')
                            .replace(/^(1[0-2]|0[1-9])([0-3][0-9])$/, '$1$2')
                            .substring(0, 4)
                        )
                      }
                      type='text'
                      placeholder='MM/DD'
                      onFocus={handleInputFocus}
                      className={errors.expiry ? 'border-red-500' : ''}
                    />
                  )}
                />
                {errors.expiry && typeof errors.expiry.message === 'string' && (
                  <p className='text-red-500 text-xs'>
                    {errors.expiry.message}
                  </p>
                )}
              </div>
              <div className='flex flex-col gap-2'>
                <label className='text-sm text-gray-700'>CVC</label>
                <Controller
                  name='cvc'
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      value={
                        field.value &&
                        field.value.replace(/\D/g, '').substring(0, 3)
                      }
                      onChange={(e) =>
                        field.onChange(
                          e.target.value.replace(/\D/g, '').substring(0, 3)
                        )
                      }
                      type='text'
                      placeholder='CVC'
                      onFocus={handleInputFocus}
                      className={errors.cvc ? 'border-red-500' : ''}
                    />
                  )}
                />
                {errors.cvc && typeof errors.cvc.message === 'string' && (
                  <p className='text-red-500 text-xs'>{errors.cvc.message}</p>
                )}
              </div>
            </div>
            <div className='flex flex-col gap-2 mb-4'>
              <label className='text-sm text-gray-700'>Zip Code</label>
              <Controller
                name='zipCode'
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    type='text'
                    placeholder='Zipcode'
                    onFocus={handleInputFocus}
                    className={errors.zipCode ? 'border-red-500' : ''}
                  />
                )}
              />
              {errors.zipCode && typeof errors.zipCode.message === 'string' && (
                <p className='text-red-500 text-xs'>{errors.zipCode.message}</p>
              )}
            </div>
            <Button
              className='bg-sorbet w-full hover:bg-sorbet hover:brightness-125'
              type='submit'
            >
              Save Card
            </Button>
          </form>
        </div>
      )}
    </div>
  );
};
