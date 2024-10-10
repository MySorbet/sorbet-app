import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from 'react';
import { twMerge } from 'tailwind-merge';

import { ActiveTab } from '@/types';

/**
 * TODO: comeback and make these types more universal. i.e remove ActiveTab and implement a way to type the name based on the list that is passed down.
 */
type Tab = {
  name: ActiveTab;
  icon?: JSX.Element;
};

type TabsListProps = {
  tabs: Array<Tab>;
  setActiveTab: Dispatch<SetStateAction<ActiveTab>>;
};

/**
 * This returns an animated tab list
 * @param tabs An array of objects with a name and an icon
 * @param setActiveTab A function to update the active tab state
 * @returns
 */
export const TabsList: React.FC<TabsListProps> = ({ tabs, setActiveTab }) => {
  const fired = useRef(false);
  const defaultSelectedTabIndex = 0;
  const [currentLink, setCurrentLink] = useState<{
    index: number;
    left: undefined | number;
    width: undefined | number;
  }>({
    index: defaultSelectedTabIndex,
    left: undefined,
    width: undefined,
  });

  /**
   * TailwindCSS scans your codebase and based on that generates styles
   * TailwindCSS does not allow to concatenate class names, so just wrote down all possible combinations (you can add more if you need, you got the idea)
   * read https://tailwindcss.com/docs/content-configuration#dynamic-class-names
   * you can not do like this - `[&:nth-child(${child})]:bg-neutral-950` it won't work
   */
  const defaultSelectedTabStyles = [
    '[&:nth-child(1)]:dark:bg-white [&:nth-child(1)]:bg-sorbet [&:nth-child(1)]:text-base',
    '[&:nth-child(2)]:dark:bg-white [&:nth-child(2)]:bg-sorbet [&:nth-child(1)]:text-base',
    '[&:nth-child(3)]:dark:bg-white [&:nth-child(3)]:bg-sorbet [&:nth-child(1)]:text-base',
    '[&:nth-child(4)]:dark:bg-white [&:nth-child(4)]:bg-sorbet [&:nth-child(1)]:text-base',
  ];

  useEffect(() => {
    setCurrentLink(() => ({
      left: document.getElementById('uuu-btn-' + defaultSelectedTabIndex)
        ?.offsetLeft,
      width: document
        .getElementById('uuu-btn-' + defaultSelectedTabIndex)
        ?.getBoundingClientRect().width,
      index: defaultSelectedTabIndex,
    }));
  }, []);

  return (
    <div className='relative flex w-fit items-center justify-center gap-2 rounded-full border border-neutral-300 p-2 backdrop-blur-2xl dark:border-neutral-800'>
      {tabs.map((tab, i) => (
        <button
          key={i}
          id={'uuu-btn-' + i}
          onClick={() => {
            fired.current = true;
            setCurrentLink(() => ({
              left: document.getElementById('uuu-btn-' + i)?.offsetLeft,
              width: document
                .getElementById('uuu-btn-' + i)
                ?.getBoundingClientRect().width,
              index: i,
            }));
            setActiveTab(tab.name);
          }}
          className={twMerge(
            'flex h-fit items-center justify-center gap-1 text-nowrap rounded-full px-3 py-1 text-base font-medium transition-colors duration-200',
            currentLink.index === i && 'text-white dark:text-neutral-900',
            fired.current
              ? ''
              : defaultSelectedTabStyles[defaultSelectedTabIndex]
          )}
        >
          {tab.name}
          {tab.icon}
        </button>
      ))}
      <div className='absolute inset-0 -z-[1] h-full overflow-hidden p-2'>
        <div className='relative h-full w-full overflow-hidden'>
          <div
            style={{
              left: `calc(${currentLink.left || 0}px - 0.75rem + 0.25rem)`,
              width: `${currentLink.width || 0}px`,
            }}
            className={twMerge(
              `absolute top-1/2 -z-[1] h-full -translate-y-1/2 rounded-full transition-[color,left,width] duration-300 `,
              //just skips animation on page load
              fired.current ? 'bg-sorbet dark:bg-white' : 'bg-transparent'
            )}
          />
        </div>
      </div>
    </div>
  );
};