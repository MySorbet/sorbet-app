import { MarkerPin02 } from '@untitled-ui/icons-react';
import { motion } from 'framer-motion';
import { Dispatch, SetStateAction } from 'react';
import {
  FieldValues,
  Path,
  PathValue,
  UseFormRegister,
  UseFormSetValue,
} from 'react-hook-form';
import useMeasure from 'react-use-measure';

import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Input } from '@/components/ui/input';
import { useGooglePlacesApi } from '@/hooks';

interface LocationInputProps<T extends FieldValues> {
  name: Path<T>;
  register: UseFormRegister<T>;
  setValue: UseFormSetValue<T>;
}

export const LocationInput = <T extends FieldValues>({
  name,
  register,
  setValue,
}: LocationInputProps<T>) => {
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
            {...register(name, {
              required: 'Location is required',
            })}
            onChange={(e) => handleLocationInputChange(e)}
            autoComplete='off'
            className='pl-10 focus:outline-none focus:ring-0'
          />
          <MarkerPin02 className='absolute left-3 top-[10px] h-5 w-5 text-[#667085]' />
        </div>
        <LocationPredictionsList
          name={name}
          predictions={predictions}
          setValue={setValue}
          setPredictions={setPredictions}
        />
      </Command>
    </div>
  );
};

interface LocationPredictionsListProps<T extends FieldValues> {
  name: Path<T>;
  setValue: UseFormSetValue<T>;
  setPredictions: Dispatch<
    SetStateAction<google.maps.places.AutocompletePrediction[]>
  >;
  predictions: google.maps.places.AutocompletePrediction[];
}

const LocationPredictionsList = <T extends FieldValues>({
  name,
  predictions,
  setValue,
  setPredictions,
}: LocationPredictionsListProps<T>) => {
  const [ref, { height }] = useMeasure();
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
        <motion.div animate={{ height }}>
          <div ref={ref}>
            {predictions.map((prediction) => (
              <CommandItem
                key={prediction.place_id}
                value={prediction.description}
                onSelect={() => {
                  setValue(
                    name,
                    prediction.description as PathValue<T, Path<T>>
                  );
                  setPredictions([]);
                }}
                className=' text-black'
              >
                {prediction.description}
              </CommandItem>
            ))}
          </div>
        </motion.div>
      </CommandGroup>
    </CommandList>
  );
};
