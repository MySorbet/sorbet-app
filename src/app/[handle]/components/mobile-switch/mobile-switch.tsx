import { AnimatedTabs } from './animated-tabs';

export const MobileSwitch = ({
  isMobile,
  onIsMobileChange,
}: {
  isMobile: boolean;
  onIsMobileChange: (isMobile: boolean) => void;
}) => {
  const selectedTab = isMobile ? 'mobile' : 'desktop';
  const onSelectTab = (tab: string) => {
    onIsMobileChange(tab === 'mobile');
  };
  return (
    <AnimatedTabs
      tabs={tabs}
      selectedTab={selectedTab}
      onSelectTab={onSelectTab}
    />
  );
};

const MobileIcon = () => {
  return (
    <svg
      width='16'
      height='16'
      viewBox='0 0 16 16'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
    >
      <rect
        x='5.5'
        y='3.5'
        width='5'
        height='9'
        rx='0.5'
        stroke='currentColor'
      />
    </svg>
  );
};

const DesktopIcon = () => {
  return (
    <svg
      width='16'
      height='16'
      viewBox='0 0 16 16'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
    >
      <rect
        x='2.43335'
        y='4.5'
        width='11.1333'
        height='7'
        rx='0.5'
        stroke='currentColor'
      />
      <rect
        x='1.5'
        y='11.5'
        width='13'
        height='2'
        rx='0.5'
        stroke='currentColor'
      />
    </svg>
  );
};

const tabs = [
  {
    id: 'desktop',
    icon: <DesktopIcon />,
    tooltip: 'How your profile looks on computers',
  },
  {
    id: 'mobile',
    icon: <MobileIcon />,
    tooltip: 'How your profile looks on phones',
  },
];
