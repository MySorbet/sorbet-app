'use client';
import Script from 'next/script';
import { useEffect } from 'react';

import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks';

/**
 * Documentation: https://help.featurebase.app/en/articles/1261560-install-feedback-widget
 */
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
      defaultBoard: 'Base launch', // optional - preselect a board
      locale: 'en',
    });
  }, []);

  return (
    <>
      <Script src='https://do.featurebase.app/js/sdk.js' id='featurebase-sdk' />
      <div>
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
        organization: 'mysorbet',
        // Required fields. Replace with your customers data.
        email: user?.email,
        name: `${user?.firstName} ${user?.lastName}`,
        id: user?.id,

        // optional
        profilePicture: user?.profileImage || '',
      },
      (err: unknown) => {
        if (err) {
          console.error(`Error initializing featurebase: ${err}`);
        }
      }
    );
  }, [
    user?.email,
    user?.firstName,
    user?.id,
    user?.lastName,
    user?.profileImage,
  ]);
};
