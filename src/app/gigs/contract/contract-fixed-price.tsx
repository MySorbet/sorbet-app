import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import React from 'react';
import { useForm, Controller } from 'react-hook-form';

export interface ContractFixedPriceData {
  projectName: string;
  totalAmount: number;
}

export interface ContractFixedPriceProps {
  onFormSubmit: (data: ContractFixedPriceData) => void;
  projectName?: string;
}

export const ContractFixedPrice = ({
  onFormSubmit,
  projectName,
}: ContractFixedPriceProps) => {
  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    mode: 'onChange',
    defaultValues: {
      projectName: projectName || '',
      totalAmount: '',
    },
  });

  const onSubmit = (data: any) => {
    const formattedData: ContractFixedPriceData = {
      projectName: data.projectName,
      totalAmount: parseFloat(data.totalAmount),
    };
    onFormSubmit(formattedData);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className='flex flex-col gap-2 mt-4'
    >
      <p className='text-center'>Set a fixed price for this contract</p>
      <Card className='p-3 rounded-2xl shadow-[0px_0px_16px_1px_#0000001F]'>
        <div className='space-y-1'>
          <Label htmlFor='projectName'>Project name</Label>
          <Controller
            name='projectName'
            control={control}
            rules={{ required: 'Project name is required' }}
            render={({ field, fieldState: { error } }) => (
              <>
                <Input
                  {...field}
                  id='projectName'
                  placeholder='Name your project'
                  value={projectName || ''}
                  disabled={!!projectName}
                />
                {error && (
                  <p className='text-red-500 text-xs mt-1'>{error.message}</p>
                )}
              </>
            )}
          />
        </div>
        <div className='space-y-1 mt-2'>
          <Label htmlFor='totalAmount'>Total Amount</Label>
          <Controller
            name='totalAmount'
            control={control}
            rules={{
              required: 'Total amount is required',
              pattern: {
                value: /^[0-9]*\.?[0-9]+$/,
                message: 'Invalid amount',
              },
            }}
            render={({ field, fieldState: { error } }) => (
              <div className='relative'>
                <Input
                  {...field}
                  id='totalAmount'
                  placeholder='Enter total amount'
                  type='number'
                  className='pr-12' // padding right to make space for the USD label
                />
                <span className='absolute inset-y-0 right-0 bottom-0 pr-4 flex items-center pointer-events-none text-sm text-gray-500'>
                  USD
                </span>
                {error && (
                  <p className='text-red-500 text-xs mt-1'>{error.message}</p>
                )}
              </div>
            )}
          />
        </div>
      </Card>
      <div className='mt-6'>
        <Button
          type='submit'
          className='w-full bg-sorbet text-white hover:bg-sorbet disabled:bg-[#DFD7F4] disabled:text-[#8764E8]'
          disabled={!isValid}
        >
          Submit Contract
        </Button>
      </div>
    </form>
  );
};
