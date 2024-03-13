/* eslint-disable @next/next/no-img-element */
import { Dispatch, SetStateAction, useEffect, useState } from 'react';

import Autocomplete from 'react-google-autocomplete';
import { config } from '@/lib/config';

interface LocationProps {
  searchLocation: string;
  setSearchLocation: Dispatch<SetStateAction<string>>;
}
const SearchByLocation: React.FC<LocationProps> = ({
  searchLocation,
  setSearchLocation,
}) => {
  const [place, setPlace] = useState<any>();

  useEffect(() => {
    if (!place || !place.address_components) return;
    setSearchLocation(place.formatted_address);
  }, [place]);

  return (
    <div className='h-full w-full'>
      <div className='relative h-full w-full items-center justify-center rounded-md outline-none'>
        <Autocomplete
          apiKey={config.googleMapKey}
          onPlaceSelected={(place) => setPlace(place)}
          defaultValue={searchLocation}
          className={`h-full w-full rounded-md
          border-[#D0D5DD] p-[10px] text-base font-normal text-[#667085]`}
          options={{
            types: ['(cities)'],
          }}
          placeholder='Search location'
        />
      </div>
    </div>
  );
};

export default SearchByLocation;
