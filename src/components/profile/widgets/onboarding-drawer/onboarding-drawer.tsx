import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';

import { HandleInput, HandleInputWidgetTypes } from './handle-input';

/**
 * This schema is used to validate the form values.
 *
 * It is a record of the widget types and the string values.
 *
 * TODO: Could be improved by validating that every key is present
 * TODO: Could be improved by validating that the value is a valid handle for the given platform
 */
const formSchema = z.record(z.enum(HandleInputWidgetTypes), z.string());
type FormSchema = z.infer<typeof formSchema>;

interface OnboardingDrawerProps {
  /** Callback for when the form is submitted. Note: This can only be done with at least one input filled */
  onSubmit: (values: FormSchema) => void;
  /** Is the drawer is open */
  open: boolean;
}

/**
 * OnboardingDrawer is a component that allows the user to input their social media handles.
 *
 * All of the entered handles are stored in the form state and submitted to the parent component.
 */
export const OnboardingDrawer = ({ onSubmit, open }: OnboardingDrawerProps) => {
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      InstagramProfile: '',
      TwitterProfile: '',
      LinkedInProfile: '',
      Github: '',
      Dribbble: '',
      Behance: '',
      Medium: '',
    },
  });

  const formValues = form.watch();
  const isFormEmpty = Object.values(formValues).every((value) => value === '');

  // TODO: Nail the scroll within the drawer (for large font sizes)
  // TODO: Forward all drawer props to the drawer?
  return (
    <Drawer open={open}>
      <DrawerContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className='mx-auto w-full max-w-xl px-4'
          >
            <DrawerHeader className='pb-2'>
              <DrawerTitle className='text-center text-base font-semibold'>
                Kickstart your Sorbet journey by adding your social profiles to
                pre-populate your page with personalized widgets
              </DrawerTitle>
            </DrawerHeader>

            {/* HandleInputs map */}
            <div className='mx-auto grid max-w-2xl grid-cols-1 gap-4 p-4 pb-0 md:grid-cols-2'>
              {HandleInputWidgetTypes.map((type) => (
                <FormField
                  control={form.control}
                  key={type}
                  name={type}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <HandleInput key={type} type={type} {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              ))}
            </div>

            <DrawerFooter className='flex flex-row justify-between'>
              <DrawerClose>
                {/* We need type='button' to prevent the form from being submitted */}
                <Button variant='outline' type='button'>
                  Skip
                </Button>
              </DrawerClose>
              <DrawerClose>
                <Button
                  type='submit'
                  className='bg-sorbet w-fit'
                  disabled={isFormEmpty}
                >
                  Finish
                </Button>
              </DrawerClose>
            </DrawerFooter>
          </form>
        </Form>
      </DrawerContent>
    </Drawer>
  );
};
