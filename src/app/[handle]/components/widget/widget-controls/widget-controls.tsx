import { zodResolver } from '@hookform/resolvers/zod';
import { PopoverAnchor } from '@radix-ui/react-popover';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import {
  Link2,
  RectangleHorizontal,
  RectangleVertical,
  Square,
  X,
} from 'lucide-react';
import { useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { z } from 'zod';

import { isValidUrl, normalizeUrl } from '@/components/profile/widgets/util';
import { Button } from '@/components/ui/button';
import { Form, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import LinkCheck from '~/svg/link-check.svg';

import { WidgetSize, WidgetSizes } from '../grid-config';
import { ControlButton } from './control-button';

// TODO:
// integrate better with design tokens
// better animations (maybe use a slider like in tabs component)
// stroke is strange on the squares
// This should close when its wrapper hides controls

/**
 * Size controls for a widget ordered by default B, D, C, A
 * Also renders a link control if the `controls` prop includes 'link'
 * You can pick the available controls through the `controls` prop
 *
 * Similar to the `<ControlBar />`
 */
export const WidgetControls = ({
  size,
  onSizeChange,
  onAddLink,
  href,
  controls = WidgetSizeControls,
}: {
  size: WidgetSize;
  onSizeChange: (size: WidgetSize) => void;
  onAddLink?: (link: string | null) => void;
  href?: string | null;
  controls?: Control[];
}) => {
  const form = useForm<FormSchema>({
    resolver: zodResolver(schema),
    values: {
      link: href ?? '',
    },
    defaultValues: {
      link: href ?? '',
    },
    mode: 'all',
  });

  const link = useWatch({ name: 'link', control: form.control });

  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  // Transform '' to null on submit to indicate clearing the link
  const onSubmit = (data: FormSchema) => {
    console.log('onSubmit', data);
    if (data.link === '') {
      onAddLink?.(null);
    } else {
      onAddLink?.(normalizeUrl(data.link) ?? null);
    }
    setIsPopoverOpen(false);
  };

  // TODO: We could handle the popover close and clear the link if its not valid

  return (
    <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
      <PopoverAnchor asChild>
        <div
          className={cn(
            'flex items-center justify-center gap-1 rounded-lg bg-[#18181B] p-1 shadow-lg'
          )}
        >
          {/* Size Buttons */}
          {controls
            .filter((control) => control !== 'link')
            .map((s) => (
              <ControlButton
                key={s}
                isActive={size === s}
                onClick={() => onSizeChange(s)}
              >
                {SizeIcons[s]}
              </ControlButton>
            ))}
          {/* Separator (only if we have link or crop) */}
          {controls.includes('link') && (
            <Separator orientation='vertical' className='h-6 bg-[#3F3F3F]' />
          )}
          {/* Link Button */}
          {controls.includes('link') && (
            <PopoverTrigger asChild>
              <ControlButton isActive={isPopoverOpen}>
                {href ? (
                  <LinkCheck className='size-4' />
                ) : (
                  <Link2 className='size-4' />
                )}
                <VisuallyHidden>Add a link</VisuallyHidden>
              </ControlButton>
            </PopoverTrigger>
          )}
          <PopoverContent
            className='max-w-52 border-none p-0'
            side='bottom'
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
                        className=' text-primary-foreground border-none bg-[#18181B] focus-visible:ring-0 focus-visible:ring-offset-0'
                        suffix={
                          link && (
                            <Button
                              variant='ghost'
                              size='sm'
                              className='text-muted-foreground fade-in animate-in -mr-1 h-fit p-1'
                              onClick={() => field.onChange('')}
                              type='button'
                            >
                              <X />
                            </Button>
                          )
                        }
                        {...field}
                      />
                    )}
                  />
                  <FormMessage />
                </FormItem>
              </form>
            </Form>
          </PopoverContent>
        </div>
      </PopoverAnchor>
    </Popover>
  );
};

/** Icons for each size button */
const SizeIcons: Record<WidgetSize, React.ReactNode> = {
  B: <Square size={11} />,
  D: <RectangleHorizontal size={19} />,
  C: <RectangleVertical size={19} />,
  A: <Square size={19} />,
};

/** Schema to validate the link input */
const schema = z.object({
  link: z.string().refine((link) => {
    return link === '' || isValidUrl(link);
  }),
});
type FormSchema = z.infer<typeof schema>;

export const Controls = [...WidgetSizes, 'link'] as const; // TODO: Add crop
export type Control = (typeof Controls)[number];
const WidgetSizeControls: Control[] = ['B', 'D', 'C', 'A']; // Order matters // TODO: Add E
export const ImageWidgetControls: Control[] = ['B', 'D', 'C', 'A', 'link']; // No E size for images (make sure to validate this on updates)
