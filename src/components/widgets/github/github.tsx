/* eslint-disable @next/next/no-img-element */
import { Octokit } from 'octokit';
import React, { useEffect, useState } from 'react';
import { AiOutlineGithub } from 'react-icons/ai';
import { ColorRing } from 'react-loader-spinner';

interface UserData {
  login?: string;
  avatar_url?: string;
  html_url?: string;
  bio?: string;
  followers?: number;
  following?: number;
  public_repos?: number;
  stargazers_count?: number;
}

interface Props {
  username?: string;
  featured_repo_names?: string[];
  width?: string;
  height?: string;
  link: any;
}

const GithubWidget = (props: Props) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [userCommitsByYear, setUserCommitsByYear] = useState<
    number | undefined
  >(undefined);
  const [userPullRequestsByYear, setUserPullRequestsByYear] = useState<
    number | undefined
  >(undefined);
  const [colorDivs, setColorDivs] = useState([]);
  const [colorKeyDiv, setColorKeyDiv] = useState([]);
  const [repoDataDiv, setRepoDataDiv] = useState([]);
  const splitUsername = props.link.split('github.com/')[1];
  //split URL to return username
  const { width, height, username, featured_repo_names } = props;

  const username_var: string = splitUsername ? splitUsername : '';
  const width_var: string = width ? width : '560px';
  const height_var: string = height ? height : '400px';
  const featured_repo_names_var: string[] = featured_repo_names
    ? featured_repo_names
    : [
        'react-widgets',
        'Qiskit_Project',
        'CinderBlox_SmartContract_Algorand',
        'CinderBlox_SmartContract',
        'Moralis_Google_Firebase_Backend',
        'Moralis_Google_Hackathon_Smart_Contract',
      ];

  const octokit = new Octokit();

  useEffect(() => {
    const runtimeAsync = async () => {
      setIsLoading(true);
      const userInfo: any = await getUserInfoByUsername(username_var);
      setUserData(userInfo);
      const userCommitsByYear = await getCommitHistory(username_var, '2023');
      setUserCommitsByYear(userCommitsByYear);
      const userPullRequestsByYear = await getPullRequestHistory(
        username_var,
        '2023'
      );
      setUserPullRequestsByYear(userPullRequestsByYear);
      const publicRepos: any = await getRepoInfoByUsername();
      const renderedRepoData: any = await renderRepoData(
        featured_repo_names_var,
        publicRepos
      );
      setRepoDataDiv(renderedRepoData);
      const repoLanguages: any = await getRepoLanguages(publicRepos);
      const languagesArr: any = await languageDataManipulation(repoLanguages);
      await renderLanguagePercentages(languagesArr);
      setIsLoading(false);
    };
    runtimeAsync();
  }, []);

  const getRepoInfoByUsername = async () => {
    try {
      const userPublicRepos: any = await octokit.rest.repos.listForUser({
        username: username_var,
        type: 'owner',
        sort: 'created',
      });
      if (userPublicRepos) {
        return userPublicRepos.data;
      } else {
        return {
          message: `Unable to fetch repo info for github user: ${username}.`,
        };
      }
    } catch (error) {
      console.log(error);
      throw new Error('Error getting repo info by username');
    }
  };

  const renderRepoData = (repoNames: string[], repoArray: object[]) => {
    try {
      const repos = repoArray
        .filter((obj) => repoNames.some((value) => (obj as any).name === value))
        .map((repo: any, i: number) => {
          const repoName = repo.name.split('').slice(0, 20).join('') + '...';
          const repoDesc =
            repo.description.split('').slice(0, 20).join('') + '...';
          return (
            <a key={i} href={repo.html_url} target='_blank' rel='noreferrer'>
              <div
                className={`h-8 w-40 rounded-xl bg-white text-center text-xs font-bold text-black ${''}`}
              >
                <p className='text-xs font-bold text-black'>{repoName}</p>
                <p className=''>{repoDesc}</p>
              </div>
            </a>
          );
        });
      return repos;
    } catch (error) {
      console.log(error)
    }
  };

  const getRepoLanguages = async (repoData: any) => {
    const language_counts: any = [];
    try {
      for (let i = 0; i < repoData.length; i++) {
        const languages = await octokit.rest.repos.listLanguages({
          owner: repoData[i].owner.login,
          repo: repoData[i].name,
        });
        if (languages) {
          language_counts.push(languages.data);
        } else {
          console.log(
            `Unable to fetch language data for github user: ${username} and repo: ${repoData[i].name}`
          );
          return {
            message: `Unable to fetch language data for github user: ${username} and repo: ${repoData[i].name}`,
          };
        }
      }
      const sumObject: any = {};
      language_counts.forEach((obj: any) => {
        Object.entries(obj).forEach(([key, value]) => {
          sumObject[key] = (sumObject[key] || 0) + value;
        });
      });
      return sumObject;
    } catch (error) {
      console.log(error);
      throw new Error('Error getting repo languages');
    }
  };

  const languageDataManipulation = async (repoLanguages: any) => {
    try {
      let totalLanuageCount = 0;
      const languages_arr: any = [];
      const reposLanguageDataArray: any = Object.entries(repoLanguages);
      for (let i = 0; i < reposLanguageDataArray.length; i++) {
        totalLanuageCount += reposLanguageDataArray[i][1];
      }
      for (let i = 0; i < reposLanguageDataArray.length; i++) {
        const object: any = {};
        object[`${reposLanguageDataArray[i][0]}`] =
          reposLanguageDataArray[i][1] / totalLanuageCount;
        languages_arr.push(object);
      }
      return languages_arr;
    } catch (error) {
      console.log(error);
      throw new Error('An Error occured. Please try again.');
    }
  };

  const renderLanguagePercentages = (languagesArr: any) => {
    try {
      if (languagesArr.length == 0) {
        return (
          <div className='text-black'>
            <p>No languages</p>
          </div>
        );
      }
      if (languagesArr.length > 0) {
        const colorKeyArray: any = [];
        const colors = [
          'F2148F',
          '1BF214',
          '14F2E1',
          '1480F2',
          'F21414',
          'F29014',
          'F7F701',
          'F701CA',
          '6D01F7',
          '28DF87',
          '0097FF',
          'D590FF',
          'FF7777',
          '97DEFF',
          '97FF9C',
        ];
        const languageArrMap = languagesArr.map((language: any, i: number) => {
          const [[key, value]] = Object.entries(language);
          const widthPercent = (value as any).toLocaleString('en', { style: 'percent' });
          const arrLength = colors.length;
          const randomIndex = Math.floor(Math.random() * arrLength);
          const colorCode = colors[randomIndex];
          colors.splice(randomIndex, 1);
          colorKeyArray.push({
            language: key,
            percentage: widthPercent,
            color: `#${colorCode}`,
          });
          return (
            <div
              key={i}
              style={{
                width: `${widthPercent}`,
                backgroundColor: `#${colorCode}`,
              }}
              className={`h-10 ${i == 0 ? 'rounded-l-lg' : null} ${
                i == languagesArr.length - 1 ? 'rounded-r-full' : null
              }`}
            ></div>
          );
        });
        setColorDivs(languageArrMap);
        const colorKeyDiv = languagesArr.map((language: any, i: number) => {
          return (
            <div key={i} className='flex space-x-2'>
              <div
                style={{ backgroundColor: colorKeyArray[i].color }}
                className='my-1 h-2 w-2 rounded-xl'
              ></div>
              <p className='text-xs'>
                {colorKeyArray[i].language} {colorKeyArray[i].percentage}
              </p>
            </div>
          );
        });
        setColorKeyDiv(colorKeyDiv);
      }
    } catch (error) {
      console.log(error);
      throw new Error('Error creating language percentage divs');
    }
  };

  const getUserInfoByUsername = async (username: string) => {
    try {
      const userInfo = await octokit.rest.users.getByUsername({
        username: username,
      });
      if (userInfo) {
        return userInfo.data;
      } else {
        console.log(`Unable to get user info for: ${username}`);
        return { message: `Unable to get user info for: ${username}` };
      }
    } catch (error) {
      console.log(error);
      throw new Error('Error getting user info');
    }
  };

  const getCommitHistory = async (username: string, year: string) => {
    try {
      const publicUserEvents =
        await octokit.rest.activity.listPublicEventsForUser({
          username: username,
          per_page: 100,
          page: 1,
        });
      if (publicUserEvents) {
        const commits = publicUserEvents.data
          .filter(
            (event: any) =>
              event.type === 'PushEvent' && event.created_at.startsWith(year)
          )
          .flatMap((event: any) => event.payload.commits);

        const totalCommits = commits.length;
        console.log(
          `Total commits pushed by ${username} in ${year}: ${totalCommits}`
        );
        return totalCommits;
      }
    } catch (error) {
      console.log(error);
      throw new Error('Error getting commit history');
    }
  };

  const getPullRequestHistory = async (username: string, year: string) => {
    try {
      const response = await octokit.rest.search.issuesAndPullRequests({
        q: `type:pr+author:${username}+created:${year}-01-01..${year}-12-31+is:public`,
      });
      const totalPullRequests = response.data.total_count;
      console.log(
        `The user ${username} created ${totalPullRequests} pull requests in ${year} in their public repositories`
      );
      return totalPullRequests;
    } catch (error) {
      console.log(error);
      throw new Error('Error getting pull request history');
    }
  };

  return (
    <>
      {isLoading ? (
        <div className='roundBorder relative flex h-full w-full  items-center justify-center rounded-xl '>
          <div className='flex h-full w-full items-center justify-center rounded-xl'>
            <div>
              <AiOutlineGithub style={{ color: 'white' }} size={'2rem'} />
            </div>
            <div className='absolute  flex items-center justify-center '>
              <ColorRing
                visible={true}
                height='80'
                width='80'
                ariaLabel='blocks-loading'
                wrapperStyle={{}}
                wrapperClass='blocks-wrapper'
                colors={['#e15b64', '#f47e60', '#f8b26a', '#abbd81', '#849b87']}
              />
            </div>
          </div>
        </div>
      ) : (
        <a href={userData?.html_url} target='_blank' rel='noreferrer'>
          {/* <div className="roundBorder flex h-full  min-h-[270px] w-full rounded-xl  bg-white ">
            <div className="flex h-full w-full flex-col rounded-xl bg-white text-black">
              <div className="flex flex-row-reverse justify-between">
                <div className="float-right m-2 flex">
                  <AiOutlineGithub style={{ color: "white" }} size={"2rem"} />
                </div>
                <div className="flex">
                  <div>
                    <img
                      className="m-4 rounded-full"
                      width={"55rem"}
                      src={userData?.avatar_url}
                      alt={`${userData?.login}'s avatar`}
                    />
                  </div>
                  <div>
                    <p className="m-2 font-bold text-white">
                      @{userData?.login}
                    </p>
                    <div className="m-2 flex space-x-4">
                      <p>Following: {userData?.following}</p>
                      <p>Followers: {userData?.followers}</p>
                    </div>
                    <div className="m-2 flex space-x-4 text-sm">
                      <p>Repos: {userData?.public_repos}</p>
                      <p>Commits: {userCommitsByYear}</p>
                      <p>Pull Requests: {userPullRequestsByYear}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="m-2 flex justify-center align-middle font-bold">
                <p className="text-white">Languages</p>
              </div>
              <div className="m-4 flex justify-center align-middle">
                <div className="flex h-2 w-9/12 rounded-xl bg-white">
                  {colorDivs}
                </div>
              </div>
              <div className="m-4 flex justify-center align-middle text-white">
                <div className="grid h-full grid-cols-3 gap-4">
                  {colorKeyDiv}
                </div>
              </div>
            </div>
          </div> */}
          <div className='border-gray-default flex w-full flex-col items-start justify-center gap-[19px] rounded-2xl border-[0.75px] bg-white p-3'>
            <div className='flex w-full items-start justify-between gap-[9px]'>
              <div className='flex flex-col items-start gap-1'>
                <div className='flex items-center gap-1'>
                  <img
                    src={userData?.avatar_url}
                    alt={`${userData?.login}'s avatar`}
                    width={19}
                    height={18}
                    className='rounded-full'
                  />
                  <div className='text-black-600/80 text-sm font-medium leading-6'>
                    @{userData?.login}
                  </div>
                </div>
                <div className='flex items-start gap-4 text-xs font-normal leading-6'>
                  <div>
                    {userData?.following}{' '}
                    <span className='opacity-60'>Followers</span>
                  </div>
                  <div>
                    {userData?.followers}{' '}
                    <span className='opacity-60'>Posts</span>
                  </div>
                </div>
              </div>
              <img
                src='/images/social/github.png'
                alt='github'
                width={24}
                height={24}
              />
            </div>
            <div className='flex w-full justify-center text-[10px] font-normal leading-6 text-black'>
              <div className='grid grid-cols-2 gap-x-4'>{colorKeyDiv}</div>
            </div>
            <div className='flex h-10 w-full w-full items-start justify-start rounded-lg'>
              <div className='flex h-10 w-full rounded-xl bg-black'>
                {colorDivs}
              </div>
            </div>
            {/* <div className='flex w-full justify-center text-[10px] font-normal leading-6 text-black'>
              <div className='grid grid-cols-2 gap-x-4'>
                {skills &&
                  skills.length > 0 &&
                  skills.map((skill) => (
                    <div className='flex items-center gap-1' key={skill.id}>
                      <div
                        className={`h-2 w-2 rounded-full bg-[${skill.color}]`}
                      ></div>
                      <div>{skill.language}</div>
                    </div>
                  ))}
              </div>
            </div>
            <div className='inline-flex h-10 w-full items-start justify-start rounded-lg'>
              {skills &&
                skills.length > 0 &&
                skills.map((skill) => (
                  <div
                    key={skill.id}
                    className={`w-[${skill.percent}] h-10 bg-[${skill.color}]`}
                  ></div>
                ))}
            </div> */}
          </div>
        </a>
      )}
    </>
  );
};

export default GithubWidget;
