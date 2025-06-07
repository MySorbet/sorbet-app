import { Button } from '@/components/ui/button';

/** Local component to render a button showing a percentage of the max amount and a callback to set that percentage*/
const PercentageButton = ({
  percentage,
  onClick,
  disabled,
}: {
  percentage: number;
  onClick?: (percentage: number) => void;
  disabled?: boolean;
}) => {
  return (
    <Button
      variant='secondary'
      className='min-w-fit flex-1'
      type='button'
      disabled={disabled}
      onClick={() => onClick?.(percentage)}
    >
      {percentage}%
    </Button>
  );
};

/** What percentages should the user be able to select? */
const PERCENTAGES = [25, 50, 75, 100];

/** A list of percentage buttons */
export const Percentages = ({
  onClick,
  disabled,
}: {
  onClick?: (percentage: number) => void;
  disabled?: boolean;
}) => {
  return (
    <div className='flex w-full gap-2'>
      {PERCENTAGES.map((percentage) => (
        <PercentageButton
          key={percentage}
          percentage={percentage}
          onClick={(percentage) => onClick?.(percentage)}
          disabled={disabled}
        />
      ))}
    </div>
  );
};
