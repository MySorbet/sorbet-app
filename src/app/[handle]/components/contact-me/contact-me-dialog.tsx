import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { Send } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useForm, useFormState } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { contactUser } from '@/api/user/user';
import {
  Credenza,
  CredenzaContent,
  CredenzaDescription,
  CredenzaHeader,
  CredenzaTitle,
} from '@/components/common/credenza/credenza';
import { Spinner } from '@/components/common/spinner';
import { Button } from '@/components/ui/button';
import { CheckIcon, CheckIconHandle } from '@/components/ui/check';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

const schema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
  subject: z.string().min(1, { message: 'Subject is required' }),
  message: z
    .string()
    .min(1, { message: 'Message is required' })
    .max(1000, { message: 'Message must be less than 1000 characters' }),
});

type FormValues = z.infer<typeof schema>;

interface ContactMeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** userId to contact */
  userId: string;
}

const DEFAULT_SUBJECT = 'New Project inquiry';
const DEFAULT_MESSAGE =
  "Love your Sorbet Profile and would love to chat more about a project I have in mind. Let me know if you're available to connect!";

export const ContactMeDialog = ({
  open,
  onOpenChange,
  userId,
}: ContactMeDialogProps) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: 'onChange',
    defaultValues: {
      email: '',
      subject: DEFAULT_SUBJECT,
      message: DEFAULT_MESSAGE,
    },
  });

  const [hasSent, setHasSent] = useState(false);

  const handleClose = () => {
    onOpenChange(false);
    setHasSent(false); // TODO: this causes an immediate dialog close skipping animation. fix this
    form.reset();
  };

  const { mutateAsync: sendMessage } = useMutation({
    mutationFn: ({
      userId,
      message,
    }: {
      userId: string;
      message: Parameters<typeof contactUser>[1];
    }) => contactUser(userId, message),
    onError: () => {
      toast.error('Failed to send message');
    },
    onSuccess: () => {
      toast.success('Message sent');
      form.reset();
      setHasSent(true);
    },
  });

  const handleSubmit = async (data: FormValues) => {
    await sendMessage({
      userId,
      message: {
        email: data.email,
        subject: data.subject,
        body: data.message,
      },
    });
  };

  const { isValid, isSubmitting } = useFormState(form);

  return (
    <Credenza open={open} onOpenChange={handleClose}>
      <CredenzaContent className='p-6' key={hasSent ? 'success' : 'form'}>
        {hasSent ? (
          <SentSuccess onClose={handleClose} />
        ) : (
          <>
            <CredenzaHeader>
              <CredenzaTitle>Let's connect</CredenzaTitle>
              <CredenzaDescription>
                Send a message to the freelancer
              </CredenzaDescription>
            </CredenzaHeader>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleSubmit)}
                className='flex flex-col gap-4'
              >
                <FormField
                  control={form.control}
                  name='email'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          placeholder='Add your email address'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='subject'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Subject</FormLabel>
                      <FormControl>
                        <Input placeholder='Add title' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='message'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Message</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder='Describe your project in detail'
                          className='max-h-72 min-h-28 w-full resize-y'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className='flex flex-col gap-3'>
                  <Button
                    type='submit'
                    variant='sorbet'
                    disabled={!isValid || isSubmitting}
                  >
                    {isSubmitting ? <Spinner /> : <Send />}
                    {isSubmitting ? 'Sending...' : 'Send message'}
                  </Button>
                </div>
              </form>
            </Form>
          </>
        )}
      </CredenzaContent>
    </Credenza>
  );
};

const SentSuccess = ({ onClose }: { onClose?: () => void }) => {
  // Animate on mount
  const checkIconRef = useRef<CheckIconHandle>(null);
  useEffect(() => {
    checkIconRef.current?.startAnimation();
  }, []);

  return (
    <div className='flex flex-col items-center gap-1.5 text-center'>
      <CheckIcon
        className='pointer-events-none [&>svg]:size-12 [&>svg]:stroke-[1.5] [&>svg]:p-1'
        ref={checkIconRef}
      />
      <CredenzaTitle>Message sent</CredenzaTitle>
      <CredenzaDescription className='text-sm'>
        You're message has been sent to the freelancer. They can reply directly
        to the email provided.
      </CredenzaDescription>
      <Button variant='sorbet' onClick={onClose} className='w-full'>
        Close
      </Button>
    </div>
  );
};
