/* eslint-disable @next/next/no-img-element */
'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import ToggleAvailable from '@/components/commons/near-wallet/toggleAvailable';
import SearchByLocation from '@/components/explore/searchByLocation';
import SearchBySkills from '@/components/explore/searchBySkills';
import UserOverView from '@/components/explore/userOverview';
import UserHeader from '@/components/Header/userHeader';

import { getUsersAll, getUsersBySearch } from '@/api/user';
import { TOTAL_SKILLS } from '@/constant/skills';
import { useAppDispatch, useAppSelector } from '@/redux/hook';
import { setUsers } from '@/redux/userSlice';

import UserType from '@/types/user';

const Explore = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.userReducer.user);
  const users = useAppSelector((state) => state.userReducer.users);
  const [isAvailable, setIsAvailable] = useState(false);
  const [searchSkills, setSearchSkills] = useState<string[]>([]);
  const [searchLocation, setSearchLocation] = useState<string>('');

  useEffect(() => {
    // const getAll = async () => {
    //   const res = await getUsersAll();
    //   const result = (res.data as UserType[]).filter(
    //     (old) => old.id != user.id
    //   );
    //   dispatch(setUsers(result));
    // };

    const getAll = async () => {
      const res = await getUsersBySearch(searchSkills, searchLocation);
      console.log(res, 'res');
      const result = (res.data as any[])?.filter((old) => old.id != user.id);
      dispatch(setUsers(result));
    };

    getAll();
  }, [user, searchSkills, searchLocation]);

  const addSkills = (selectedSkill: string) => {
    if (!searchSkills.includes(selectedSkill) && searchSkills.length < 5) {
      setSearchSkills([...searchSkills, selectedSkill]);
    }
  };

  const onInputChange = (e: any) => {
    setSearchLocation(e.target.value);
    // console.log(e.target.value);
  };

  return (
    <>
      <div className='flex min-h-screen w-full flex-col items-center justify-start gap-[45px] bg-[#F9FAFB] pt-[45px]'>
        <div className='flex h-full w-[80%] flex-wrap justify-center gap-x-4 gap-y-10'>
          <div className='flex w-full items-center gap-4'>
            <div className='flex w-[calc(100%-60px)] flex-row gap-4 self-stretch'>
              <SearchBySkills
                options={TOTAL_SKILLS}
                placeholder='Search'
                onSelect={addSkills}
                searchSkills={searchSkills}
                setSearchSkills={setSearchSkills}
              />
              {/* <SearchByLocation
                searchLocation={searchLocation}
                setSearchLocation={setSearchLocation}
                onInputChange={onInputChange}
              /> */}
              <input
                className='h-full w-full rounded-md
                border-[#D0D5DD] p-[10px] text-base font-normal text-[#667085]'
                defaultValue={searchLocation}
                placeholder='Location'
                onChange={onInputChange}
              />
            </div>
            <ToggleAvailable
              isAvailable={isAvailable}
              setIsAvailable={setIsAvailable}
            />
          </div>
          {users &&
            users.map((user: UserType) => (
              <UserOverView key={user?.id} user={user} />
            ))}
        </div>
      </div>
    </>
  );
};

export default Explore;
