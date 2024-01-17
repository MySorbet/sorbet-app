/* eslint-disable @next/next/no-img-element */
import { useCallback, useEffect, useRef, useState } from 'react';
import { ReactTags } from 'react-tag-autocomplete';

import { skills } from '@/constant/skills';


const Skills = () => {
  const [selected, setSelected] = useState<any[]>([]);

  const onAdd = useCallback(
    (newTag:any) => {
      setSelected([...selected, newTag]);
    },
    [selected]
  );

  const onDelete = useCallback(
    (tagIndex:any) => {
      setSelected(selected.filter((skills, i) => i !== tagIndex));
    },
    [selected]
  );

  return (
    <div className='item w-full'>
      <label className='text-sm font-medium text-[#344054]'>
        Add your skills
      </label>
      <div className='relative flex w-full'>
        <img
          src='/images/search-lg.svg'
          className='absolute left-[14px] top-[10px]'
          alt='search'
          width={20}
          height={20}
        />
        {/* <input
          className='w-full rounded-lg pl-[42px] text-base font-normal text-[#667085]'
          name='tags'
        /> */}
        <ReactTags
          selected={selected}
          suggestions={skills}
          onAdd={onAdd}
          onDelete={onDelete}
          noOptionsText='No matching countries'
          classNames={`w-full rounded-lg pl-[42px] text-base font-normal text-[#667085]`} 
        />
      </div>
      {/* <TagsInput
        value={skillList}
        onChange={setSkillList}
        name='tags'
        placeHolder='tags'
        className='w-full rounded-lg text-base font-normal text-[#667085]'
      /> */}
      <label className='text-sm font-normal text-[#475467]'>Max 5 skills</label>
    </div>
  );
};

export default Skills;
