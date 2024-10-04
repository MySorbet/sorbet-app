import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

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

interface CreditCardDialogProps {
  onSubmit: (data: any) => void;
  isOpen: boolean;
  onClose: () => void;
  initialState?: {
    cardName?: string;
    cardNumber?: string;
    expiry?: string;
    cvc?: string;
    zipCode?: string;
  };
}

export const CreditCardDialog = ({
  onSubmit,
  isOpen,
  onClose,
  initialState = {},
}: CreditCardDialogProps) => {
  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    resolver: zodResolver(schema),
    mode: 'onChange',
    defaultValues: initialState,
  });

  const isEditMode =
    !!initialState.cardName ||
    !!initialState.cardNumber ||
    !!initialState.expiry ||
    !!initialState.cvc ||
    !!initialState.zipCode;

  const formatCardNumber = (value: string) => {
    return value
      .replace(/\s?/g, '')
      .replace(/(\d{4})/g, '$1 ')
      .trim();
  };

  const formatExpiry = (value: string) => {
    return value
      .replace(
        /^([1-9]\/|[2-9])$/g,
        '0$1' // 3 -> 03
      )
      .replace(
        /^(0[1-9]|1[0-2])$/g,
        '$1/' // 11 -> 11/
      )
      .replace(
        /^([0-1])([3-9])$/g,
        '0$1/$2' // 13 -> 01/3
      )
      .replace(
        /^(0[1-9]|1[0-2])([0-9]{1,2}).*/g,
        '$1/$2' // 141 -> 01/41
      );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogOverlay className='bg-black/70' />
      <DialogContent className='p-8 sm:rounded-3xl'>
        <DialogHeader>
          <DialogTitle className='text-3xl font-normal'>
            {isEditMode ? 'Edit Card' : 'Add Card'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className='grid gap-4 py-4'>
            <div className='flex flex-col'>
              <Label
                htmlFor='cardName'
                className='text-md mb-2 text-left font-normal text-[#344054]'
              >
                Full name
              </Label>
              <Controller
                name='cardName'
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    id='cardName'
                    placeholder='Add name'
                    className={`${errors.cardName ? 'border-red-500' : ''}`}
                  />
                )}
              />
              {errors.cardName &&
                typeof errors.cardName.message === 'string' && (
                  <p className='text-xs text-red-500'>
                    {errors.cardName.message}
                  </p>
                )}
            </div>

            <div className='flex flex-col'>
              <Label
                htmlFor='cardNumber'
                className='text-md mb-2 text-left font-normal text-[#344054]'
              >
                Card number
              </Label>
              <Controller
                name='cardNumber'
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    id='cardNumber'
                    placeholder='1234 1234 1234 1234'
                    className={`${errors.cardNumber ? 'border-red-500' : ''}`}
                    onChange={(e) =>
                      field.onChange(e.target.value.replace(/\s/g, ''))
                    }
                    value={formatCardNumber(field.value || '')}
                  />
                )}
              />
              {errors.cardNumber &&
                typeof errors.cardNumber.message === 'string' && (
                  <p className='text-xs text-red-500'>
                    {errors.cardNumber.message}
                  </p>
                )}
            </div>
            <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
              <div className='flex flex-col'>
                <Label
                  htmlFor='expiry'
                  className='text-md mb-2 text-left font-normal text-[#344054]'
                >
                  Exp Date
                </Label>
                <Controller
                  name='expiry'
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      id='expiry'
                      placeholder='MM/YY'
                      className={`${errors.expiry ? 'border-red-500' : ''}`}
                      onChange={(e) =>
                        field.onChange(e.target.value.replace(/\D/g, ''))
                      }
                      value={formatExpiry(field.value || '')}
                    />
                  )}
                />
                {errors.expiry && typeof errors.expiry.message === 'string' && (
                  <p className='text-xs text-red-500'>
                    {errors.expiry.message}
                  </p>
                )}
              </div>
              <div className='flex flex-col'>
                <Label
                  htmlFor='cvc'
                  className='text-md mb-2 text-left font-normal text-[#344054]'
                >
                  CVC
                </Label>
                <Controller
                  name='cvc'
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      id='cvc'
                      placeholder='***'
                      className={`${errors.cvc ? 'border-red-500' : ''}`}
                    />
                  )}
                />
                {errors.cvc && (
                  <p className='text-xs text-red-500'>
                    {typeof errors.cvc.message === 'string' &&
                      errors.cvc.message}
                  </p>
                )}
              </div>
            </div>
            <div className='flex flex-col'>
              <Label
                htmlFor='zipCode'
                className='text-md mb-2 text-left font-normal text-[#344054]'
              >
                Zip Code
              </Label>
              <Controller
                name='zipCode'
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    id='zipCode'
                    placeholder='00000'
                    className={`${errors.zipCode ? 'border-red-500' : ''}`}
                  />
                )}
              />
              {errors.zipCode && (
                <p className='text-xs text-red-500'>
                  {typeof errors.zipCode.message === 'string' &&
                    errors.zipCode.message}
                </p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button
              type='submit'
              className='bg-sorbet w-full'
              disabled={!isValid}
            >
              {isEditMode ? 'Edit Card' : 'Add Card'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
