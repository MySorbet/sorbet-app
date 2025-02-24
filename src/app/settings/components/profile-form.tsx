import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useSettingsForm } from '../hooks/use-settings-form';
import { SettingsSection } from './settings-section';

export const ProfileForm = () => {
  const { form, onSubmit, isDirty, isValid, updateProfilePending } = useSettingsForm();

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='flex w-full flex-col gap-12'>
        <SettingsSection label='Basic information' description='Name and location to be displayed on your profile header'>
          <FormField
            name='firstName'
            control={form.control}
            render={({ field }) => (
              <FormItem className='w-full max-w-md'>
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <Input placeholder='Your first name' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name='lastName'
            control={form.control}
            render={({ field }) => (
              <FormItem className='w-full max-w-md'>
                <FormLabel>Last Name</FormLabel>
                <FormControl>
                  <Input placeholder='Your last name' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </SettingsSection>

        <div className='flex justify-end'>
          <Button 
            type='submit'
            className='bg-sorbet'
            disabled={updateProfilePending || !isDirty || !isValid}
          >
            {updateProfilePending ? (
              <>
                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                Saving Changes
              </>
            ) : (
              'Save Changes'
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}; 