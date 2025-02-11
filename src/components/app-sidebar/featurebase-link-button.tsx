'use client';

import Script from 'next/script';
import { useEffect, useRef } from 'react';

import { MenuItemProps } from '@/components/app-sidebar/app-sidebar';
import { SidebarMenuButton } from '@/components/ui/sidebar';

import { isAnimatedIcon, SidebarIcon } from './sidebar-icon';

/**
 * Documentation: https://help.featurebase.app/en/articles/1261560-install-feedback-widget
 */
export const FeaturebaseLinkButton = ({
  item,
}: {
  item: Omit<MenuItemProps, 'url'>;
}) => {
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

  const iconRef = useRef<any>(null);

  const handleMouseEnter = () => {
    if (iconRef.current && isAnimatedIcon(iconRef.current)) {
      iconRef.current?.startAnimation?.();
    }
  };

  const handleMouseLeave = () => {
    if (iconRef.current && isAnimatedIcon(iconRef.current)) {
      iconRef.current?.stopAnimation?.();
    }
  };

  return (
    <>
      <Script src='https://do.featurebase.app/js/sdk.js' id='featurebase-sdk' />
      <SidebarMenuButton
        data-featurebase-feedback
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <SidebarIcon iconRef={iconRef} Icon={item.icon} />
        <span>{item.title}</span>
      </SidebarMenuButton>
    </>
  );
};
