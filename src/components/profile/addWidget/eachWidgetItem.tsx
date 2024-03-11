/* eslint-disable @next/next/no-img-element */

import { addWidget } from '@/redux/profileSlice';
import axios from 'axios';
import { config } from '@/lib/config';
import { useAppDispatch } from '@/redux/hook';
import { useState } from 'react';
import { validateUrl } from '../urlUtils';

interface Props {
  widgetName: any;
  userId: string;
}

const EachWidgetItem = ({ widgetName, userId }: Props) => {
  const dispatch = useAppDispatch();
  const [widget, setWidget] = useState<any>({
    url: '',
    type: widgetName,
    userId: userId,
  });
  const [isSubtmitting, setIsSubmitting] = useState(false);
  const [isError, setIsError] = useState(false);

  const onChange = (e: any) => {
    setWidget({ ...widget, [e.target.name]: e.target.value });
    setIsError(false);
  };

  const add = async (e: any) => {
    e.preventDefault();

    if (!widget.url) {
      return;
    }
    if (validateUrl(widget.url, widget.type)) {
      console.log('Is valid');
    } else {
      console.log('Is not valid');
      setIsError(true);
      return;
    }

    const apiUrl = `${config.devApiUrl}/widgets/create`;
    try {
      setIsSubmitting(true); // Start submitting

      const res = await axios.post(apiUrl, widget);

      console.log(res.data, '@@@');
      dispatch(addWidget(res.data));
      setWidget({
        ...widget,
        url: '',
      });
      setIsError(false);
    } catch (err: any) {
      console.log(err);
    } finally {
      setIsSubmitting(false); // Finish submitting
    }
  };

  return (
    <>
      {isError && (
        <div className='roundBorderForm absolute left-0 right-0 top-[-100px] mx-auto mt-8 flex w-[55%] items-center justify-center rounded-xl bg-rose-500 p-[10px]'>
          <p className='flex items-center justify-center text-white'>
            Invalid URL
          </p>
        </div>
      )}
      <div
        key={widgetName}
        className='self-strech bg-primary flex h-11 w-full items-center justify-end gap-2 rounded-lg border-2 border-solid border-gray-100 bg-[#FAFAFA] py-2.5 pl-4 pr-2'
      >
        <img
          src={`/images/social/${widgetName}.png`}
          alt={widgetName}
          width={24}
          height={24}
        />
        <input
          className='h-6 w-full border-none bg-[#FAFAFA]'
          placeholder='Paste link here'
          name='url'
          value={widget.url}
          onChange={onChange}
        />
        <button
          className='gap-2 rounded-lg bg-[#6230EC] px-3 py-1.5 text-sm text-white'
          disabled={isSubtmitting}
          onClick={(e) => add(e)}
        >
          Add
        </button>
      </div>
    </>
  );
};

export default EachWidgetItem;
