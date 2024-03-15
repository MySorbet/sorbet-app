/* eslint-disable @next/next/no-img-element */
import { config } from '@/lib/config';
import { cn } from '@/lib/utils';
import type { User } from '@/types';
import { MapPin } from 'lucide-react';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import Autocomplete from 'react-google-autocomplete';

interface LocationProps {
  userData: User;
  setUserData: Dispatch<SetStateAction<User>>;
  onInputChange: (e: any) => void;
  defaultValue: string | undefined;
}

export const InputLocation: React.FC<LocationProps> = ({
  userData,
  setUserData,
  onInputChange,
  defaultValue,
}) => {
  const [place, setPlace] = useState<any>();

  useEffect(() => {
    if (!place || !place.address_components) return;
    setUserData({
      ...userData,
      tempLocation: place.formatted_address,
    });
  }, [place]);

  return (
    <div className='flex flex-row gap-4 bg-white w-full mt-1'>
      <div
        className={cn(
          'flex items-center border border-2 border-gray-200 px-2 rounded-xl flex-grow '
        )}
      >
        <div>
          <MapPin stroke={`gray`} />
        </div>
        <Autocomplete
          apiKey={config.googleMapKey}
          onPlaceSelected={(place) => setPlace(place)}
          onChange={(e) => onInputChange(e)}
          defaultValue={defaultValue}
          className={`h-full w-full rounded-md border-[#D0D5DD] p-[10px] text-base font-normal text-[#667085] outline-none`}
          options={{
            types: ['(cities)'],
          }}
          placeholder='Enter your city, country'
        />
      </div>
    </div>
  );
};
