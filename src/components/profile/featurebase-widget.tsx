'use client'; // NextJS 13 requires this. Remove if you are using NextJS 12 or lower
import Script from 'next/script';
import { useEffect } from 'react';

import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks';

const FeaturebaseWidget = () => {
  useInitilizeFeaturebase();

  useEffect(() => {
    const win = window as any;

    if (typeof win.Featurebase !== 'function') {
      win.Featurebase = function () {
        // eslint-disable-next-line prefer-rest-params
        (win.Featurebase.q = win.Featurebase.q || []).push(arguments);
      };
    }

    win.Featurebase('initialize_feedback_widget', {
      organization: 'mysorbet', // Replace this with your organization name, copy-paste the subdomain part from your Featurebase workspace url (e.g. https://*yourorg*.featurebase.app)
      theme: 'light',
      email: 'youruser@example.com', // optional
      defaultBoard: 'Base launch', // optional - preselect a board
      locale: 'en', // Change the language, view all available languages from https://help.featurebase.app/en/articles/8879098-using-featurebase-in-my-language
      metadata: null, // Attach session-specific metadata to feedback. Refer to the advanced section for the details: https://help.featurebase.app/en/articles/3774671-advanced#7k8iriyap66
    });
  }, []);

  return (
    <>
      <Script src='https://do.featurebase.app/js/sdk.js' id='featurebase-sdk' />
      <div>
        {/*If you wish to open the widget using your own button you can do so here.
           To get rid of our floating button, remove 'placement' from the Featurebase('initialize_feedback_widget') call above.
          */}
        <Button
          data-featurebase-feedback
          className='border border-[#D0D5DD] bg-white text-sm font-semibold text-[#344054] hover:bg-gray-100'
        >
          Feedback
        </Button>
      </div>
    </>
  );
};

export default FeaturebaseWidget;

const useInitilizeFeaturebase = () => {
  const { user } = useAuth();
  useEffect(() => {
    const win = window as any;

    if (typeof win.Featurebase !== 'function') {
      win.Featurebase = function () {
        // eslint-disable-next-line prefer-rest-params
        (win.Featurebase.q = win.Featurebase.q || []).push(arguments);
      };
    }
    win.Featurebase(
      'identify',
      {
        // Each 'identify' call should include an "organization"
        // property, which is your Featurebase board's name before the
        // ".featurebase.app".
        organization: 'mysorbet',

        // Required fields. Replace with your customers data.
        email: user?.email,
        name: `${user?.firstName} ${user?.lastName}`,
        id: user?.id,

        // Optional - add a profile picture to the user
        profilePicture: user?.profileImage || '',
      },
      (err: unknown) => {
        // Callback function. Called when identify completed.
        if (err) {
          console.error(`Error initializing featurebase: ${err}`);
        } else {
          // console.log("Data sent successfully!");
        }
      }
    );
  }, []);
};
