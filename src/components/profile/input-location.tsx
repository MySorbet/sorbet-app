/* eslint-disable @next/next/no-img-element */
import { config } from '@/lib/config';
import { cn } from '@/lib/utils';
import { MapPin } from 'lucide-react';
import { useState } from 'react';
import Autocomplete from 'react-google-autocomplete';

interface LocationProps {
  onInputChange: (e: any) => void;
  onPlaceSelected: (place: any) => void;
  defaultValue: string | undefined;
}

export const InputLocation: React.FC<LocationProps> = ({
  onInputChange,
  onPlaceSelected,
  defaultValue,
}) => {
  const [place, setPlace] = useState<any>();

  return (
    <div className='mt-1 flex w-full flex-row gap-4 bg-white'>
      <div
        className={cn(
          'flex flex-grow items-center rounded-xl border border-2 border-gray-200 px-2 '
        )}
      >
        <div>
          <MapPin stroke={`gray`} />
        </div>
        <Autocomplete
          apiKey={config.googleMapKey}
          onPlaceSelected={(place) => onPlaceSelected(place)}
          onChange={(e) => onInputChange(e)}
          defaultValue={defaultValue}
          className={`z-50 h-full w-full p-[10px] text-base font-normal text-[#667085] outline-none`}
          options={{
            types: ['(cities)'],
          }}
        />
      </div>
    </div>
  );
};
