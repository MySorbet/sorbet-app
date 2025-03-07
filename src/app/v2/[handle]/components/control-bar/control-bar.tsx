import { zodResolver } from '@hookform/resolvers/zod';
import { PopoverAnchor } from '@radix-ui/react-popover';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { Link2, Plus } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { isValidUrl, normalizeUrl } from '@/components/profile/widgets/util';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Form, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

import { AddImageButton } from './add-image-button';

// TODO: Add separator (with proper height) and button border
// TODO: Read the clipboard and if it's a url, show a paste button
// TODO: If a url is pasted with ctrl+v, submit right away

/** Toolbar containing controls to edit and share the profile */
export const ControlBar = ({
  onAddImage,
  onAddLink,
}: {
  onAddImage?: (image: File) => void;
  onAddLink?: (link: string) => void;
}) => {
  const form = useForm<FormSchema>({
    resolver: zodResolver(schema),
    defaultValues: {
      link: '',
    },
    mode: 'onChange',
  });

  const onSubmit = (data: FormSchema) => {
    onAddLink?.(normalizeUrl(data.link) ?? '');
  };

  return (
    <Popover>
      <PopoverAnchor asChild>
        <Card className='h-fit shadow-lg'>
          <CardContent className='flex h-full items-center justify-between gap-4 px-3 py-2'>
            <Button variant='sorbet'>Share profile</Button>
            <div className='flex items-center gap-2'>
              <PopoverTrigger asChild>
                <Button variant='secondary' className='h-fit p-1'>
                  <Link2 />
                  <VisuallyHidden>Add link</VisuallyHidden>
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className='relative border-none p-0'
                side='top'
                sideOffset={4}
              >
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
                    <FormItem>
                      <FormField
                        control={form.control}
                        name='link'
                        render={({ field }) => (
                          <Input
                            type='url'
                            placeholder='paste link'
                            className='focus-visible:ring-0 focus-visible:ring-offset-0'
                            {...field}
                          />
                        )}
                      />
                      <FormMessage />
                    </FormItem>
                    <Button
                      variant='sorbet'
                      className='absolute bottom-0 right-2 top-0 my-auto h-fit p-1'
                      disabled={!form.formState.isValid}
                    >
                      <Plus />
                    </Button>
                  </form>
                </Form>
              </PopoverContent>
              <AddImageButton onAdd={onAddImage} />
            </div>
          </CardContent>
        </Card>
      </PopoverAnchor>
    </Popover>
  );
};

const schema = z.object({
  link: z.string().refine(isValidUrl),
});
type FormSchema = z.infer<typeof schema>;
