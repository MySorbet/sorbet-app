import { ReactNode } from 'react';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

import { VerifyCard } from './verify-card';

// TODO: Update links

/** Renders an FAQ Accordion with information and a learn more button */
export const FAQ = ({ className }: { className?: string }) => {
  return (
    <VerifyCard className={cn('w-full min-w-72 max-w-2xl', className)}>
      <div className='flex flex-col gap-3'>
        <h2 className='text-2xl font-semibold'>FAQ</h2>
        <Accordion type='multiple' className='w-full'>
          <AccordionItem value='item-1'>
            <AccordionTrigger>What is KYC?</AccordionTrigger>
            <AccordionContent>
              KYC ("Know Your Customer") verification is a common background
              check process to verify your identity by asking you to provide
              basic personal information. Once you complete it, it will allow
              you to accept payments in USD. For any additional information
              reach out to{' '}
              <Hyperlink href='mailto:maher@mysorbet.xyz'>
                maher@mysorbet.xyz
              </Hyperlink>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value='item-2'>
            <AccordionTrigger>How does it work?</AccordionTrigger>
            <AccordionContent>
              Users from{' '}
              <Hyperlink href='https://docs.mysorbet.xyz/sorbet/getting-started#complete-kyc'>
                supported countries
              </Hyperlink>{' '}
              can complete it in less than 3 minutes. You will need to provide a
              few basic information about you to confirm your identity. Sorbet
              works with{' '}
              <Hyperlink href='https://docs.mysorbet.xyz/sorbet/getting-started#complete-kyc'>
                Bridge
              </Hyperlink>{' '}
              and{' '}
              <Hyperlink href='https://docs.mysorbet.xyz/sorbet/getting-started#complete-kyc'>
                Persona
              </Hyperlink>{' '}
              for a simple and secure process. Once verified you will receive a
              confirmation email.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value='item-3'>
            <AccordionTrigger>Why do I need to get verified?</AccordionTrigger>
            <AccordionContent>
              This verification will allow your clients to pay invoices in USD,
              while continuing to receive USDC in your Sorbet wallet. In order
              to provide security on our platform and our users, Sorbet verifies
              your identity. This allows us to comply with anti-money laundering
              regulations and prevent fraudulent activity.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        <Button variant='secondary' className='w-fit' asChild>
          <a href='https://docs.mysorbet.xyz/sorbet/getting-started#complete-kyc'>
            Learn more
          </a>
        </Button>
      </div>
    </VerifyCard>
  );
};

const Hyperlink = ({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) => {
  return (
    <a href={href} className='text-sorbet font-semibold hover:underline'>
      {children}
    </a>
  );
};
