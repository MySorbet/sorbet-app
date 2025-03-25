import { motion } from 'framer-motion';

import { ClaimYourHandleForm } from './claim-your-handle-form';
import { FakeWidgetGrid } from './fake-widget-grid';

/**
 * The first step in onboarding to the new profiles.
 * A full page allowing you to claim your handle (either by saving your pregenerated one or by generating a new one).
 * And rendering a fake widget grid.
 */
export const ClaimYourHandle = () => {
  return (
    <div className='@container size-full'>
      <div className='@5xl:mx-0 @5xl:max-w-none @5xl:pt-6 mx-auto flex h-full max-w-96 flex-col'>
        <div className='@5xl:flex-row flex flex-1 flex-col items-start gap-4 p-6'>
          <div className='@5xl:w-auto @5xl:max-w-96 w-full'>
            <ClaimYourHandleForm />
          </div>
          <div className='@5xl:flex-1 flex w-full flex-1 items-start justify-center'>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.5 }}
            >
              <FakeWidgetGrid animated />
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};
