import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AmericanFlagIcon from '~/svg/american-flag-icon.svg';

/** Render details for the users accounts */
export const MyAccounts = () => {
  return (
    <Card className='h-fit'>
      <CardHeader className='bg-primary-foreground rounded-t-md px-4 py-6 '>
        <CardTitle className='flex items-center gap-2 text-base font-semibold'>
          <AmericanFlagIcon className='size-8' />
          Digital Dollars
        </CardTitle>
      </CardHeader>
      <CardContent className='space-y-6 p-3'>
        {/* USDC Account */}
        {/* USD Account */}
      </CardContent>
    </Card>
  );
};
