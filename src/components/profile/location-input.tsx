import { MarkerPin02 } from '@untitled-ui/icons-react';
import { Dispatch, SetStateAction } from 'react';
import { UseFormRegister, UseFormSetValue } from 'react-hook-form';

import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Input } from '@/components/ui/input';
import { useGooglePlacesApi } from '@/hooks';

interface LocationInputProps {
  register?: UseFormRegister<{
    city: string;
    firstName: string;
    lastName: string;
    bio: string;
    tags: string[];
  }>;
  setValue: UseFormSetValue<{
    city: string;
    firstName: string;
    lastName: string;
    bio: string;
    tags: string[];
  }>;
}

export const LocationInput = ({ register, setValue }: LocationInputProps) => {
  const { predictions, setPredictions, handleLocationInputChange } =
    useGooglePlacesApi();

  return (
    <div className='relative'>
      <Command>
        <div className='relative'>
          <Input
            id='location-input'
            type='text'
            placeholder='Type a location'
            {...(register &&
              register('city', {
                required: 'Location is required',
              }))}
            onChange={(e) => handleLocationInputChange(e)}
            autoComplete='off'
            className='pl-10 focus:outline-none focus:ring-0'
            onBlur={() => setPredictions([])}
          />
          <MarkerPin02 className='absolute left-3 top-[10px] h-5 w-5 text-[#667085]' />
        </div>
        <LocationPredictionsList
          predictions={predictions}
          setValue={setValue}
          setPredictions={setPredictions}
        />
      </Command>
    </div>
  );
};

const LocationPredictionsList = ({
  predictions,
  setValue,
  setPredictions,
}: {
  predictions: google.maps.places.AutocompletePrediction[];
  setValue: UseFormSetValue<{
    city: string;
    firstName: string;
    lastName: string;
    bio: string;
    tags: string[];
  }>;
  setPredictions: Dispatch<
    SetStateAction<google.maps.places.AutocompletePrediction[]>
  >;
}) => {
  return (
    <CommandList
      className={
        predictions.length
          ? // TODO: Update the styling here. Kind of flaky in that we are moving the list down with fixed values.
            'absolute top-10 mt-1 w-full rounded-lg border border-gray-200 bg-white text-black drop-shadow-xl'
          : 'hidden'
      }
    >
      <CommandGroup>
        {predictions.map((prediction) => (
          <CommandItem
            key={prediction.place_id}
            value={prediction.description}
            onSelect={() => {
              setValue('city', prediction.description);
              setPredictions([]);
            }}
            className=' text-black'
          >
            {prediction.description}
          </CommandItem>
        ))}
      </CommandGroup>
    </CommandList>
  );
};
