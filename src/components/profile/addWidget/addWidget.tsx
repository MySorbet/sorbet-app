/* eslint-disable @next/next/no-img-element */
import EachWidgetItem from '@/components/profile/addWidget/eachWidgetItem';

import { useAppSelector } from '@/redux/hook';

const widgetTypes = [
  { id: 1, name: 'dribbble' },
  { id: 2, name: 'github' },
  { id: 3, name: 'soundCloud' },
  { id: 4, name: 'spotify' },
  { id: 5, name: 'instgram' },
  { id: 6, name: 'youtube' },
];

const AddSocialLink = () => {
  const userId = useAppSelector((state) => state.userReducer.user.id);
  return (
    <>
      <div className='right-7.5 absolute bottom-[84px] flex w-[315px] flex-col items-start gap-0.5'>
        {widgetTypes &&
          widgetTypes.map((widgetType) => (
            <EachWidgetItem
              widgetName={widgetType.name}
              userId={userId}
              key={widgetType.id}
            />
          ))}
      </div>
    </>
  );
};

export default AddSocialLink;
