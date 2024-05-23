import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus as IconPlus, Trash2 as IconTrash } from 'lucide-react';
import React from 'react';
import { useForm, Controller } from 'react-hook-form';

const Milestone = ({
  control,
  index,
  onDelete,
}: {
  control: any;
  index: number;
  onDelete: (index: number) => void;
}) => {
  return (
    <Card className='p-3 rounded-2xl shadow-[0px_0px_16px_1px_#0000001F]'>
      <div className='space-y-1'>
        <Label htmlFor={`milestone-name-${index}`}>Milestone {index}</Label>
        <Controller
          name={`milestone-name-${index}`}
          control={control}
          rules={{ required: 'Milestone name is required' }}
          render={({ field, fieldState: { error } }) => (
            <>
              <Input
                {...field}
                id={`milestone-name-${index}`}
                placeholder='Name your milestone'
              />
              {error && (
                <p className='text-red-500 text-xs mt-1'>{error.message}</p>
              )}
            </>
          )}
        />
      </div>

      <div className='space-y-1 mt-1'>
        <Label htmlFor={`milestone-amount-${index}`}>Amount</Label>
        <Controller
          name={`milestone-amount-${index}`}
          control={control}
          rules={{
            required: 'Amount is required',
            pattern: {
              value: /^[0-9]*\.?[0-9]+$/,
              message: 'Invalid amount',
            },
          }}
          render={({ field, fieldState: { error } }) => (
            <div className='relative'>
              <Input
                {...field}
                id={`milestone-amount-${index}`}
                placeholder='Enter amount'
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
      {index > 1 && (
        <div className='mt-3 flex justify-end text-sorbet'>
          <div
            onClick={() => onDelete(index)}
            className='flex items-center align-center justify-center cursor-pointer hover:bg-gray-100 p-2 rounded-md'
          >
            <IconTrash size={18} />
          </div>
        </div>
      )}
    </Card>
  );
};

export interface ContractMilestone {
  name: string;
  amount: number;
}
export interface ContractMilestonesFormData {
  projectName: string;
  milestones: ContractMilestone[];
}

export interface ContractMilestonesProps {
  onFormSubmit: (data: ContractMilestonesFormData) => void;
  projectName?: string;
}

export const ContractMilestones = ({
  onFormSubmit,
  projectName,
}: ContractMilestonesProps) => {
  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    trigger,
    getValues,
  } = useForm({
    mode: 'onChange',
    defaultValues: {
      'project-name': projectName || '',
      milestones: [],
    },
  });

  const [milestones, setMilestones] = React.useState([{ id: 1 }]);

  const addMilestone = () => {
    const newId = milestones.length + 1;
    setMilestones([...milestones, { id: newId }]);
  };

  const deleteMilestone = async (index: number) => {
    setMilestones(milestones.filter((_, i) => i + 1 !== index));
    await trigger(); // Re-evaluate form validation after deleting a milestone
  };

  const onSubmit = (formData: any) => {
    const data: ContractMilestonesFormData = {
      projectName: formData['project-name'],
      milestones: milestones.map((_, index) => ({
        name: formData[`milestone-name-${index + 1}`],
        amount: parseFloat(formData[`milestone-amount-${index + 1}`]),
      })),
    };
    onFormSubmit(data);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className='flex flex-col gap-2 mt-4'
    >
      <h2 className='text-center'>Break your project down into milestones.</h2>
      <Card className='p-3 rounded-2xl shadow-[0px_0px_16px_1px_#0000001F]'>
        <div className='space-y-1'>
          <Label htmlFor='project-name'>Project name</Label>
          <Controller
            name='project-name'
            control={control}
            rules={{ required: 'Project name is required' }}
            render={({ field, fieldState: { error } }) => (
              <>
                <Input
                  {...field}
                  id='project-name'
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
      </Card>
      <>
        {milestones.map((milestone, index) => (
          <Milestone
            key={milestone.id}
            index={index + 1}
            onDelete={deleteMilestone}
            control={control}
          />
        ))}
      </>
      <div className='flex justify-end'>
        <span
          onClick={addMilestone}
          className='flex gap-1 items-center cursor-pointer hover:underline text-sorbet font-semibold text-sm'
        >
          Add milestone <IconPlus size={18} />
        </span>
      </div>
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
