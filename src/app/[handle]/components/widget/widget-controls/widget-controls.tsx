'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { PopoverAnchor } from '@radix-ui/react-popover';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { Link, X } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { z } from 'zod';

import { isValidUrl, normalizeUrl } from '@/components/profile/widgets/util';
import { Button } from '@/components/ui/button';
import { Form, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { LinkCheckIcon, LinkCheckIconHandle } from '@/components/ui/link-check';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import { useAfter } from '@/hooks/use-after';

import { LayoutSizes, WidgetSize } from '../grid-config';
import { ControlButton } from './control-button';
import { Control, SizeControls } from './control-config';
import { ControlContainer } from './control-container';

// TODO: better animations (maybe use a slider like in tabs component)

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
  controls = SizeControls,
  isPopoverOpen = false,
  setIsPopoverOpen,
}: {
  /** The active size */
  size: WidgetSize;
  /** Callback to change the size */
  onSizeChange: (size: WidgetSize) => void;
  /** Callback to add a link */
  onAddLink?: (link: string | null) => void;
  /** A link to prefill the input with */
  href?: string | null;
  /** The controls to display */
  controls?: Control[];
  /** Whether the link popover is open */
  isPopoverOpen?: boolean;
  /** Callback to set the link popover open state */
  setIsPopoverOpen?: (isPopoverOpen: boolean) => void;
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

  // Transform '' to null on submit to indicate clearing the link
  const addLink = useAfter((link: string) => {
    if (link === '') {
      onAddLink?.(null);
    } else {
      onAddLink?.(normalizeUrl(link) ?? null);
    }
  });

  const onSubmit = (data: FormSchema) => {
    addLink(data.link);
    setIsPopoverOpen?.(false);
  };

  // Animate the link check icon when the link is set
  const linkCheckRef = useRef<LinkCheckIconHandle>(null);
  useEffect(() => {
    if (href) {
      linkCheckRef.current?.startAnimation();
    } else {
      linkCheckRef.current?.stopAnimation();
    }
  }, [href]);

  // TODO: We could handle the popover close and clear the link if its not valid

  const showSeparator = controls.includes('link'); // TODO: Or crop
  const showLinkButton = controls.includes('link');

  return (
    <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
      <PopoverAnchor asChild>
        <ControlContainer>
          {/* Size Buttons */}
          {controls
            .filter((control) => control !== 'link')
            .map((s) => (
              <ControlButton
                key={s}
                isActive={size === s}
                onClick={() => onSizeChange(s)}
              >
                <SizeIcon size={s} />
              </ControlButton>
            ))}
          {/* Separator */}
          {showSeparator && (
            <Separator orientation='vertical' className='h-6 bg-[#3F3F3F]' />
          )}
          {/* Link Button */}
          {showLinkButton && (
            <PopoverTrigger asChild>
              <ControlButton isActive={isPopoverOpen}>
                {href ? (
                  <LinkCheckIcon
                    ref={linkCheckRef}
                    disableHoverAnimation
                    className='[&>svg]:size-4'
                  />
                ) : (
                  <Link className='size-4' />
                )}
                <VisuallyHidden>Add a link</VisuallyHidden>
              </ControlButton>
            </PopoverTrigger>
          )}
          <PopoverContent
            className='max-w-52 border-none p-0'
            side='bottom'
            sideOffset={4}
            onCloseAutoFocus={(e) => {
              // This prevents the trigger button from being focused when the popover closes.
              // TODO: This could be an accessibility issue.
              e.preventDefault();
            }}
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
                        className='text-primary-foreground border-none bg-[#18181B] focus-visible:ring-0 focus-visible:ring-offset-0'
                        suffix={
                          link && (
                            <Button
                              variant='ghost'
                              size='sm'
                              className='text-muted-foreground fade-in animate-in -mr-1 h-fit p-1'
                              onClick={() => {
                                field.onChange('');
                                form.handleSubmit(onSubmit)();
                              }}
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
        </ControlContainer>
      </PopoverAnchor>
    </Popover>
  );
};

// TODO: stroke is strange on the squares

/** Local component to generate an SVG rendered as an icon for a given widget size */
const SizeIcon = ({ size }: { size: WidgetSize }) => {
  const { w: unitWidth, h: unitHeight } = LayoutSizes[size];
  const scale = 4;
  // Scale everything down by 1.2 to fit in the 16x16 box with room for stroke
  const scaleFactor = 1.2;
  const width = (unitWidth * scale) / scaleFactor;
  const height = (unitHeight * scale) / scaleFactor;

  return (
    <svg
      width='16'
      height='16'
      viewBox='0 0 16 16'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
    >
      <rect
        x={8 - width / 2}
        y={8 - height / 2}
        width={width}
        height={height}
        rx='0.5'
        strokeWidth='1.3'
        stroke='currentColor'
      />
    </svg>
  );
};

/**
 * Schema to validate the link input
 * Valid of the url is valid OR the user clears the link ('')
 */
const schema = z.object({
  link: z.string().refine((link) => {
    return link === '' || isValidUrl(link);
  }),
});
type FormSchema = z.infer<typeof schema>;
