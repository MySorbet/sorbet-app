export type StepperProps = {
  /** The current step number */
  step: number;
  /** The total number of steps */
  totalSteps: number;
};

// TODO: This could be shared with the onboarding flow
/**
 * A simple stepper component that displays the current step and the total number of steps as text.
 *
 * i.e. "Step 2 of 3"
 */
export const Stepper = ({ step, totalSteps }: StepperProps) => {
  return (
    <span className='text-muted-foreground text-sm font-medium'>
      {`Step ${step} of ${totalSteps}`}
    </span>
  );
};
