'use client';
import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { AiOutlineDribbble } from 'react-icons/ai';
import {
  BsFillArrowLeftCircleFill,
  BsFillArrowRightCircleFill,
} from 'react-icons/bs';
import { FcDribbble } from 'react-icons/fc';
import { ColorRing } from 'react-loader-spinner';
// import { createDribbleAccessToken } from '@/api/widgets'

interface UserData {
  avatar_url: string;
  bio: string;
  email: string;
  followers_count: number;
  html_url: string;
  location: string;
  login: string;
  name: string;
}

interface imageURLs {
  normal: string;
}

interface DesignData {
  id: string;
  title: string;
  html_url: string;
  images: imageURLs;
  description: string;
  tags: string[];
}

const DRIBBLE_CLIENT_ID = process.env.NEXT_PUBLIC_DRIBBLE_CLIENT_ID;
const DRIBBLE_CLIENT_SECRET = process.env.NEXT_PUBLIC_DRIBBLE_CLIENT_SECRET;

const DribbleDesignWidget = (props: any) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [shotSelected, setShotSelected] = useState<boolean>(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [dribbbleCode, setDribbbleCode] = useState<string | null>(null);
  const [designsData, setDesignsData] = useState<DesignData[] | null>(null);
  const [design, setDesign] = useState<DesignData | null>(null);
  const [accessToken, setAccessToken] = useState<string>('');
  const [showModal, setShowModal] = useState<boolean>(true);
  const [scrollPosition, setScrollPosition] = useState<number>(0);
  const [scrollPage, setScrollPage] = useState<number>(0);
  const [isWidget, setIsWidget] = useState(false);
  const scrollRef = useRef<any | null>(null);

  const { width, height, username, loggedInUser, setDribbleModalIsActive } =
    props;

  const username_var: string = username ? username : 'daenamcclintock';
  const width_var: string = width ? width : '560px';
  const height_var: string = height ? height : '400px';

  useEffect(() => {
    const runtimeAsync = async () => {
      setIsLoading(true);
      const dribbble_code: string = await getDribbleCode();
      // const token = await getAccessToken(dribbble_code)
      const token =
        'cf4bb0fb028aa707f840d82b21415f7b95b5464582edb784fcc88c88e3914c2d';
      setAccessToken(token);
      await getUser(token);
      await getShots(token);
      await getUserProjects(token);
      setIsLoading(false);
    };
    runtimeAsync();
  }, []);

  const getDribbleCode = async () => {
    const URL = window.location.href;
    const code = URL.split('=')[1];
    console.log(code);
    setDribbbleCode(code);
    return code;
  };

  const getAccessToken = async (dribbbleCode: string) => {
    // const apiUrl = `http://localhost:3002/widgets/createDribbbleAccessToken`;
    const apiUrl = `${process.env.NEXT_PUBLIC_DEV_API_URL}/widgets/createDribbbleAccessToken`;
    console.log('dribbbleCode', dribbbleCode);
    return axios
      .post(apiUrl, { dribbbleCode: dribbbleCode })
      .then((res) => {
        console.log(res);
        if (res.status == 201) {
          return res.data;
        } else {
          console.log(`Error creating dribbble access token`);
        }
      })
      .catch((error) => {
        console.error(error);
        throw new Error(`An error occured. Please try again.`);
      });
  };

  const getUser = async (accessToken: string) => {
    await fetch(`https://api.dribbble.com/v2/user?access_token=${accessToken}`)
      .then((response) => response.json())
      .then((data) => {
        setUserData(data);
        return data;
      })
      .catch((error) => console.error(error));
  };

  const getShots = async (accessToken: string) => {
    await fetch(
      `https://api.dribbble.com/v2/user/shots?access_token=${accessToken}`
    )
      .then((response) => response.json())
      .then((data) => {
        setDesignsData(data);
        setDesign(data[0]);
        return data;
      })
      .catch((error) => console.error(error));
  };

  const getUserProjects = async (accessToken: string) => {
    await fetch(
      `https://api.dribbble.com/v2/user/projects?access_token=${accessToken}`
    )
      .then((response) => response.json())
      .then((data) => {
        console.log('userProjects', data);
      })
      .catch((error) => console.error(error));
  };

  const handleScrollLeft = () => {
    setScrollPosition(
      (prevPosition: number) => prevPosition - scrollRef.current.offsetWidth
    );
    setScrollPage((prevPosition: number) => prevPosition - 1);
  };

  const handleScrollRight = () => {
    setScrollPosition(
      (prevPosition: number) => prevPosition + scrollRef.current.offsetWidth
    );
    setScrollPage((prevPosition: number) => prevPosition + 1);
  };

  const handleSubmit = async (shot: any) => {
    const apiUrl = `${process.env.NEXT_PUBLIC_DEV_API_URL}/widgets/create`;
    const data = {
      name: shot?.title,
      description: shot?.description,
      type: 'Dribbble_Shot',
      oauthToken: accessToken,
      userId: props.loggedInUser.id,
    };
    try {
      setDribbleModalIsActive(false);

      const res = await axios.post(apiUrl, data);
      console.log('SUCCESS => ', res);
      const redirect = setTimeout(
        // () => window.location.replace(`/profile/${props.loggedInUser.id}`),
        () => window.location.replace(`/profile`),
        500
      );
      return () => {
        clearTimeout(redirect);
      };
    } catch (err) {
      console.log('DRIBBLE ERROR => ');
      console.log(err);
    }
  };

  const tags = design?.tags.map((tag: string, key: number) => {
    return (
      <div key={key} className='w-1/3 rounded-xl bg-[#ea4c89]'>
        <p className='p-1 text-center text-sm text-white'>{tag}</p>
      </div>
    );
  });

  const shotCards = designsData?.map((shot: any, key: number) => {
    return (
      <div
        key={key}
        className='flex flex-nowrap'
        ref={scrollRef}
        style={{
          transform: `translateX(-${scrollPosition}px)`,
        }}
      >
        <button
          onClick={() => {
            setShowModal(false);
            setShotSelected(true);
            setDesign(shot);
            handleSubmit(shot);
            // handleSubmit
            console.log(shot);
          }}
          className='m-4 rounded-xl hover:border'
          style={{
            width: '150px',
            height: '100px',
            backgroundImage: `url(${shot?.images.normal})`,
            backgroundRepeat: 'no-repeat',
            backgroundSize: '150px 100px',
          }}
        />
      </div>
    );
  });

  const pageDots = designsData?.map((shot: any, key: number) => {
    return (
      <div
        key={key}
        className={`h-2 w-2 rounded-full border ${
          scrollPage == key ? 'bg-[#ea4c89]' : null
        }`}
      />
    );
  });

  return (
    <>
      {props.isWidget ? (
        <>
          <div className='roundBorder relative flex h-full min-h-[270px] w-full  items-center justify-center  '>
            <div
              style={{
                backgroundImage: `url(${design?.images.normal})`,
              }}
              className='h-full w-full rounded-[10px] bg-cover object-cover'
            >
              <div className='absolute right-2 top-2 float-right m-2 flex'>
                <AiOutlineDribbble style={{ color: 'black' }} size={'2rem'} />
              </div>

              <div className='absolute left-2 top-2'>
                <img
                  className='mb-1 ml-6 mt-3 rounded-full'
                  width={'60rem'}
                  src={userData?.avatar_url}
                  alt={`${userData?.login}'s avatar`}
                />
                <p className='ml-2 text-xs font-semibold text-black'>
                  {userData?.name}
                </p>
                <p className='ml-2 text-xs font-medium text-black'>
                  @{userData?.login}
                </p>
                <p className='ml-2 text-xs text-gray-500'>
                  {userData?.location}
                </p>
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className='flex h-screen items-center justify-center'>
            {showModal && (
              <div className='fixed left-0 top-0 z-50 flex h-full w-full items-center justify-center bg-black bg-opacity-50'>
                <div className='max-w-lg rounded-lg bg-white px-8 pt-8 shadow-lg'>
                  <h2 className='mb-4 text-center text-2xl font-bold'>
                    Dribbble Shots Gallery
                  </h2>
                  {isLoading ? (
                    <div className='flex justify-center align-middle'>
                      <ColorRing
                        visible={true}
                        height='80'
                        width='80'
                        ariaLabel='blocks-loading'
                        wrapperStyle={{}}
                        wrapperClass='blocks-wrapper'
                        colors={[
                          '#e15b64',
                          '#f47e60',
                          '#f8b26a',
                          '#abbd81',
                          '#849b87',
                        ]}
                      />
                    </div>
                  ) : (
                    <>
                      <div className='flex overflow-x-hidden'>{shotCards}</div>
                    </>
                  )}
                  <div className='flex justify-center space-x-48 p-4'>
                    <button
                      className={`rounded-full text-center ${
                        scrollPosition <= 0
                          ? 'text-gray-400'
                          : 'cursor-pointer text-[#ea4c89] hover:text-[#d73c7d]'
                      }`}
                      onClick={handleScrollLeft}
                      disabled={scrollPosition === 0}
                    >
                      <BsFillArrowLeftCircleFill size={'1.1rem'} />
                    </button>
                    <div className='flex justify-center'>
                      <FcDribbble size={'1.5rem'} />
                      <p className='mt-1 text-xs font-semibold'>ribble</p>
                    </div>
                    <button
                      className={`rounded-full text-center ${
                        scrollPosition ===
                          scrollRef.current?.scrollWidth -
                            scrollRef.current?.clientWidth +
                            1 ||
                        scrollPage == (designsData && designsData?.length - 1)
                          ? 'text-gray-400'
                          : 'cursor-pointer text-[#ea4c89] hover:text-[#d73c7d]'
                      }`}
                      onClick={handleScrollRight}
                      disabled={
                        designsData != undefined &&
                        scrollPage == designsData?.length - 1
                      }
                    >
                      <BsFillArrowRightCircleFill size={'1.1rem'} />
                    </button>
                  </div>
                  <div className='flex justify-center space-x-1'>
                    {pageDots}
                  </div>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
};

export default DribbleDesignWidget;
