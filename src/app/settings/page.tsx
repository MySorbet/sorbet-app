'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';


const formSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
});

type SettingsFormSchema = z.infer<typeof formSchema>;

interface SettingsPageProps {
  defaultValues?: {
    firstName: string;
    lastName: string;
  };
}

const SettingsPage = ({ defaultValues }: SettingsPageProps) => {
  const form = useForm<SettingsFormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues || {
      firstName: '',
      lastName: '',
    },
    mode: 'onTouched',
  });

  const handleSubmit = form.handleSubmit((data) => {
    // Handle form submission
    console.log(data);
  });

  return (
    <main className='bg-background flex w-full p-6'>
      <div className='flex flex-col md:flex-row w-full max-w-6xl mx-auto gap-6 md:gap-2 self-start'>
        <div className='w-full md:w-[466px] mb-6 md:mb-0'>
          <h2 className='text-2xl font-bold mb-2 h-[28px]'>Basic information</h2>
          <p className='text-muted-foreground h-[20px]'>
            Name and location to be displayed on your profile header
          </p>
        </div>
        <div className='w-full md:w-[466px]'>
          <Form {...form}>
            <form onSubmit={handleSubmit} className='flex flex-col gap-6'>
              <FormField
                name='firstName'
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='h-[14px] block mb-[2px]'>First Name</FormLabel>
                    <FormControl>
                      <Input className='h-[36px]' placeholder='Your first name' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name='lastName'
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='h-[14px] block mb-[2px]'>Last Name</FormLabel>
                    <FormControl>
                      <Input className='h-[36px]' placeholder='Your last name' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </div>
      </div>
    </main>
  );
};

export default SettingsPage;