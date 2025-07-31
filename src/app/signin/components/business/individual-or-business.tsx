import {
  CardButton,
  CardButtonContent,
  CardButtonDescription,
  CardButtonTitle,
} from './card-button';

/**
 * User decides if they are a business or individual at login
 */
export const IndividualOrBusiness = ({
  onSelect,
}: {
  onSelect?: (type: 'individual' | 'business') => void;
}) => {
  return (
    <div className='flex size-full items-center justify-center'>
      <div className='flex max-w-96 flex-col items-center justify-center gap-3'>
        <span className='text-base font-semibold'>
          What describes you best?
        </span>
        <CardButton className='w-full' onClick={() => onSelect?.('individual')}>
          <CardButtonContent>
            <CardButtonTitle>Individual</CardButtonTitle>
            <CardButtonDescription>
              You are a sole trader or freelancer
            </CardButtonDescription>
          </CardButtonContent>
        </CardButton>
        <CardButton className='w-full' onClick={() => onSelect?.('business')}>
          <CardButtonContent>
            <CardButtonTitle>Business</CardButtonTitle>
            <CardButtonDescription>
              You are a registered company or charity
            </CardButtonDescription>
          </CardButtonContent>
        </CardButton>
      </div>
    </div>
  );
};
