import { motion } from 'framer-motion';

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

type Tab = {
  id: string;
  icon: React.ReactNode;
  tooltip?: string;
};

/**
 * An animated tab switch based on [Build UI's AnimatedTabs](https://buildui.com/recipes/animated-tabs).
 * - built with Framer Motion's `layoutId` and `mix-blend-difference`
 * TODO: Remove hardcoded colors
 */
export const AnimatedTabs = ({
  tabs,
  selectedTab: selectedTabProp,
  onSelectTab,
}: {
  tabs: Tab[];
  selectedTab: string;
  onSelectTab: (tab: string) => void;
}) => {
  const selectedTab = selectedTabProp ?? tabs[0].id;
  return (
    <div className='flex w-fit space-x-1 rounded-full border border-[#E4E4E7] p-1'>
      {tabs.map((tab) => (
        <Tooltip key={tab.id}>
          <TooltipTrigger asChild>
            <button
              key={tab.id}
              aria-label={tab.tooltip}
              onClick={() => onSelectTab(tab.id)}
              className={cn(
                'relative rounded-full p-1 text-sm font-medium text-[#E4E4E7] transition focus-visible:outline-2',
                selectedTab !== tab.id && 'hover:text-black/60',
                selectedTab === tab.id && 'text-black shadow-lg'
              )}
              style={{
                WebkitTapHighlightColor: 'transparent',
              }}
            >
              {selectedTab === tab.id && (
                <motion.span
                  layoutId='bubble'
                  layoutDependency={selectedTab}
                  className='absolute inset-0 z-10 bg-white mix-blend-difference'
                  style={{ borderRadius: 9999 }}
                  transition={{ type: 'spring', bounce: 0, duration: 0.3 }}
                />
              )}
              {tab.icon}
            </button>
          </TooltipTrigger>
          <TooltipContent
            className='max-w-40 text-center'
            side='top'
            sideOffset={12}
          >
            <p>{tab.tooltip}</p>
          </TooltipContent>
        </Tooltip>
      ))}
    </div>
  );
};
