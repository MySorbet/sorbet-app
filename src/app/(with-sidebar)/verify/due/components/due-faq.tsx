import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/use-auth';
import { cn } from '@/lib/utils';

import { VerifyCard } from '../../components/verify-card';

export const DueFAQ = ({ className }: { className?: string }) => {
  const { user } = useAuth();
  const isBusiness = user?.customerType === 'business';
  return (
    <VerifyCard className={cn('w-full', className)}>
      <div className='flex flex-col gap-3'>
        <h2 className='text-2xl font-semibold'>FAQ</h2>
        <Accordion type='multiple' className='w-full'>
          <AccordionItemOne isBusiness={isBusiness} />
          <AccordionItem value='item-2'>
            <AccordionTrigger className='text-left'>
              How does it work?
            </AccordionTrigger>
            <AccordionContent>
              Sorbet uses Due to verify your identity and issue virtual accounts
              for fiat on-ramping. Once verified, you can receive local bank
              transfers that settle into your Sorbet wallet.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value='item-3'>
            <AccordionTrigger className='text-left'>
              Why do I need to get verified?
            </AccordionTrigger>
            <AccordionContent>
              Verification is required to comply with KYC/KYB regulations and
              to enable fiat on-ramping. It helps keep the platform secure and
              reliable for everyone.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        <Button variant='secondary' className='w-fit' asChild>
          <a href='https://due.readme.io/docs/overview'>Learn more</a>
        </Button>
      </div>
    </VerifyCard>
  );
};

const AccordionItemOne = ({ isBusiness }: { isBusiness: boolean }) => {
  return (
    <AccordionItem value='item-1'>
      <AccordionTrigger className='text-left'>
        What is {isBusiness ? 'KYB' : 'KYC'}?
      </AccordionTrigger>
      {isBusiness ? (
        <AccordionContent>
          KYB (“Know Your Business”) confirms a business entity’s legitimacy.
          You’ll provide basic company details and authorized representatives to
          complete verification.
        </AccordionContent>
      ) : (
        <AccordionContent>
          KYC ("Know Your Customer") is a verification process used to confirm
          your identity. You’ll provide basic personal information to complete
          verification.
        </AccordionContent>
      )}
    </AccordionItem>
  );
};
