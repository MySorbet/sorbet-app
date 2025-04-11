import { zodResolver } from '@hookform/resolvers/zod';
import { PopoverAnchor } from '@radix-ui/react-popover';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { Info, Link2, Plus } from 'lucide-react';
import { forwardRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { isValidUrl, normalizeUrl } from '@/components/profile/widgets/util';
import { Button, ButtonProps } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Form, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import { TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Tooltip } from '@/components/ui/tooltip';
import { useAfter } from '@/hooks/use-after';
import { cn } from '@/lib/utils';

import { MobileSwitch } from '../mobile-switch/mobile-switch';
import { AddImageButton } from './add-image-button';

// TODO: Read the clipboard and if it's a url, show a paste button
// TODO: If a url is pasted with ctrl+v, submit right away
// TODO: Find the right token for the border rather than hardcoding it

/** Toolbar containing controls to edit and share the profile */
export const ControlBar = ({
  onAddImage,
  onAddLink,
  onShare,
  isMobile,
  onIsMobileChange,
  isDisabled,
}: {
  /** Called when a valid image is added */
  onAddImage?: (image: File) => void;
  /** Called when a valid link is added */
  onAddLink?: (link: string) => void;
  /** Called when the share button is clicked */
  onShare?: () => void;
  /** Whether the control bar is disabled */
  isDisabled?: boolean;

  /** Whether the control bar is in mobile mode */
  isMobile?: boolean;
  /** Called when the mobile mode is toggled. Omit to hide the mobile switch */
  onIsMobileChange?: (isMobile: boolean) => void;
}) => {
  const form = useForm<FormSchema>({
    resolver: zodResolver(schema),
    defaultValues: {
      link: '',
    },
    mode: 'onChange',
  });

  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const onSubmit = (data: FormSchema) => {
    onAddLink?.(normalizeUrl(data.link) ?? '');
    handlePopoverOpenChange(false);
  };

  // Build a fn to reset after the popover closes
  const reset = useAfter(form.reset);
  const handlePopoverOpenChange = (open: boolean) => {
    setIsPopoverOpen(open);
    !open && reset();
  };

  const showMobileSwitch = onIsMobileChange !== undefined;

  return (
    <Popover open={isPopoverOpen} onOpenChange={handlePopoverOpenChange}>
      <PopoverAnchor asChild>
        <Card className='h-fit rounded-xl shadow-lg'>
          <CardContent
            className={cn(
              'flex h-full items-center justify-between gap-4 p-2',
              !showMobileSwitch && 'pr-3' // concentric rounding
            )}
          >
            <Button variant='sorbet' size='sm' effect='shine' onClick={onShare}>
              Share
            </Button>
            <Separator orientation='vertical' className='h-9' />
            {isDisabled ? (
              <DisabledPopoverButton />
            ) : (
              <div className='flex items-center gap-2'>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <PopoverTrigger asChild>
                      <ControlBarIconButton>
                        <Link2 />
                        <VisuallyHidden>Add a link</VisuallyHidden>
                      </ControlBarIconButton>
                    </PopoverTrigger>
                  </TooltipTrigger>
                  <TooltipContent>Add a link</TooltipContent>
                </Tooltip>
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
            )}
            {showMobileSwitch && (
              <>
                <Separator orientation='vertical' className='h-9' />
                <MobileSwitch
                  isMobile={Boolean(isMobile)}
                  onIsMobileChange={onIsMobileChange}
                />
              </>
            )}
          </CardContent>
        </Card>
      </PopoverAnchor>
    </Popover>
  );
};

/** Schema to validate the link input */
const schema = z.object({
  link: z.string().refine(isValidUrl),
});
type FormSchema = z.infer<typeof schema>;

// Local component rendering a popover to let users know that editing links is desktop only
const DisabledPopoverButton = () => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <ControlBarIconButton>
          <Info />
          <VisuallyHidden>Switch to desktop</VisuallyHidden>
        </ControlBarIconButton>
      </PopoverTrigger>
      <PopoverContent
        className='w-fit max-w-64 space-y-1 p-3 text-sm'
        side='top'
        sideOffset={20}
      >
        <span className='font-semibold'>Editing links is desktop only</span>
        <p>We're working on a mobile editing experience. Check back soon 🚀</p>
      </PopoverContent>
    </Popover>
  );
};

// Base component for the control bar icon buttons
const ControlBarIconButton = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, ...props }, ref) => {
    return (
      <Button
        variant='secondary'
        className='h-fit border border-[#E5E7EB] p-1 transition-transform hover:scale-110'
        {...props}
        ref={ref}
      >
        {children}
      </Button>
    );
  }
);
