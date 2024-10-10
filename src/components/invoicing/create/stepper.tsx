export type StepperProps = {
  step: number;
  totalSteps: number;
};

export const Stepper = ({ step, totalSteps }: StepperProps) => {
  return (
    <span className='text-muted-foreground text-sm font-medium'>
      {`Step ${step} of ${totalSteps}`}
    </span>
  );
};
