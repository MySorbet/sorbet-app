import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import * as React from 'react';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';

import Confetti, { ConfettiRef } from '@/components/magicui/confetti';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

const projectSchema = z.object({
  projectName: z
    .string()
    .min(1, 'Project name is required')
    .max(30, 'Project name must be at most 30 characters'),
  description: z
    .string()
    .min(1, 'Description is required')
    .max(100, 'Projecr description can be 100 characters maximum'),
  projectStarting: z.enum(['Immediately', 'Flexible']),
  budget: z.number().min(1, 'Budget must be greater than zero'),
});

export type ProjectFormValues = z.infer<typeof projectSchema>;

interface ProjectOfferDialogProps {
  isOpen: boolean;
  name?: string;
  formSubmitted?: boolean;
  onClose: (open: boolean) => void;
  onSubmit: (data: ProjectFormValues) => void;
}

export const ProjectOfferDialog: React.FC<ProjectOfferDialogProps> = ({
  onSubmit,
  isOpen,
  onClose,
  name,
  formSubmitted,
}) => {
  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    mode: 'onChange', // This will enable re-validation on every change
    defaultValues: {
      projectName: '',
      description: '',
      projectStarting: 'Immediately',
      budget: 0,
    },
  });

  const budgetValue = watch('budget');

  const handleBudgetChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.replace(/[^0-9]/g, '');
    setValue('budget', value ? parseInt(value) : 0);
  };

  const formattedBudget = budgetValue ? `$${budgetValue.toLocaleString()}` : '';

  const onFormSubmit = (data: ProjectFormValues) => {
    setLoading(true);
    onSubmit(data);
  };

  // Internal loading state which listens to props
  const [loading, setLoading] = useState(false);
  React.useEffect(() => {
    if (formSubmitted) setLoading(false);
  }, [formSubmitted]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogTitle className='text-2xl'>
          Message {name && <span>{name}</span>}
        </DialogTitle>
        {formSubmitted && (
          <FormSubmitted onClose={() => onClose(false)} name={name} />
        )}
        {!formSubmitted && (
          <form onSubmit={handleSubmit(onFormSubmit)}>
            <div className='my-6 flex flex-col gap-2'>
              <Label className='text-medium text-[#344054]'>Project name</Label>
              <Input {...register('projectName')} placeholder='Project Name' />
              <span className='text-light text-sm text-[#344054]'>
                Max. 30 characters
              </span>
              {errors.projectName && (
                <span className='text-red-500'>
                  {errors.projectName.message}
                </span>
              )}
            </div>
            <div className='my-6 flex flex-col gap-2'>
              <Label className='text-medium text-[#344054]'>
                Describe your project
              </Label>
              <Textarea
                {...register('description')}
                placeholder='Description'
                rows={8}
              />
              <span className='text-light text-sm text-[#344054]'>
                Max. 100 characters
              </span>
              {errors.description && (
                <span className='text-red-500'>
                  {errors.description.message}
                </span>
              )}
            </div>
            <div className='my-6 flex flex-col gap-2'>
              <Label>Project starting</Label>
              <Controller
                name='projectStarting'
                control={control}
                render={({ field }) => (
                  <Select {...field}>
                    <SelectTrigger aria-label='Project Starting'>
                      <SelectValue placeholder='Select starting time' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='Immediately'>Immediately</SelectItem>
                      <SelectItem value='Flexible'>Flexible</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
            <div className='my-6 flex flex-col gap-2'>
              <Label>Budget</Label>
              <Input
                type='text'
                value={formattedBudget}
                onChange={handleBudgetChange}
                placeholder='$0'
              />
              {errors.budget && (
                <span className='text-red-500'>{errors.budget.message}</span>
              )}
            </div>
            <Button type='submit' className='bg-sorbet w-full'>
              {loading ? (
                <>
                  <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                  Sending
                </>
              ) : (
                'Send Message'
              )}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

const FormSubmitted = ({
  onClose,
  name = 'the freelancer',
}: {
  onClose: () => void;
  name?: string;
}) => {
  // This bit allows us to fire the confetti on mount, overcoming the issue
  // where the confetti would not fire if the component was mounted in the same render cycle
  const confettiRef = React.useRef<ConfettiRef>(null);
  React.useEffect(() => {
    const timer = setTimeout(() => {
      confettiRef.current?.fire();
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className='align-center flex w-full flex-col items-center justify-center'>
      <Confetti
        ref={confettiRef}
        className='pointer-events-none absolute left-0 top-0 z-0 size-full'
      />
      <div className='align-center animate-in fade-in-10 my-24 flex w-full flex-col items-center justify-center gap-2 text-center'>
        <div className='text-center text-6xl'>🎉</div>
        <div className='text-3xl font-medium'>Your message was sent</div>
        <div className='text-muted-foreground text-lg'>
          {`You will receive a notification when ${name} replies`}
        </div>
      </div>

      <Button className='bg-sorbet w-full' onClick={onClose}>
        Back to profile
      </Button>
    </div>
  );
};
