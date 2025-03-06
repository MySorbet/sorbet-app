import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

// TODO: Update imports from @/components/profile once components are moved
import {
  SocialHandleInput,
  SocialHandleInputWidgetTypes,
} from '@/components/profile/widgets/onboarding-drawer/social-handle-input';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormItem } from '@/components/ui/form';
import { FormField } from '@/components/ui/form';

// TODO: See onboarding drawer to improve this
const formSchema = z.record(z.enum(SocialHandleInputWidgetTypes), z.string());
type FormSchema = z.infer<typeof formSchema>;

// TODO: In general, revisit this component in comparison to the onboarding drawer
/**
 * Render a list of inputs to accept handles for the onboarding flow
 *
 * Originally based on the onboarding drawer, and carries over some patterns.
 */
export const OnboardWithHandles = () => {
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: Object.fromEntries(
      SocialHandleInputWidgetTypes.map((type) => [type, ''])
    ),
  });

  // TODO: Maybe onSubmit should clear the form?
  const handleSubmit = form.handleSubmit((data) => {
    console.log(data);
  });

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} className='flex max-w-80 flex-col gap-6'>
        <div className='space-y-2'>
          <h2 className='text-2xl font-semibold'>Add widgets</h2>
          <p className='text-muted-foreground text-lg'>
            Showcase your work, reviews, and credentials—all in one place.
            Perfect for building trust and attracting clients.
          </p>
        </div>
        {/* Map SocialHandleInputWidgetTypes to inputs */}
        <div className='space-y-2'>
          {SocialHandleInputWidgetTypes.map((type) => (
            <FormField
              control={form.control}
              key={type}
              name={type}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <SocialHandleInput key={type} type={type} {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
          ))}
        </div>
        <Button type='submit' variant='sorbet' disabled>
          Add social accounts
        </Button>
      </form>
    </Form>
  );
};
