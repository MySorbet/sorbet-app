import React, { useEffect, useState } from 'react';

import DribbleDesignWidget from '@/components/widgets/dribbble/dribbble';
import GithubWidget from '@/components/widgets/github/github';
import InstagramAccountWidget from '@/components/widgets/instagram/profile';
import SoundCloudWidget from '@/components/widgets/soundcloud/soundcloud';
import SpotifyWidget from '@/components/widgets/spotify/spotify';
import YoutubeVideoWidget from '@/components/widgets/youtube/video';
import GithubWidgetOverview from '@/components/widgets/github/githubOverview';
import DribbleDesignWidgetOverview from '@/components/widgets/dribbble/dribbbleOverview';
import InstagramAccountWidgetOverview from '@/components/widgets/instagram/profileOverview';
import SoundCloudWidgetOverview from '@/components/widgets/soundcloud/soundcloudOverview';
import YoutubeVideoWidgetOverview from '@/components/widgets/youtube/videoOverview';
import SpotifyWidgetOverview from '@/components/widgets/spotify/spotifyOverview';

interface Props {
  // id: string,
  link: string;
  type: string;
  size?: string;
}

const UserWidgetContainer = ({ link, type, size }: Props) => {
  const [widgetType, setWidgetType] = useState<any>(null);
  useEffect(() => {
    if (type === 'github') {
      // if(size == 'small') {
      //   setWidgetType(<GithubWidgetOverview link={link} />);
      // } else {
      //   setWidgetType(<GithubWidget link={link}/>);
      // }
      setWidgetType(
        size ? (
          <GithubWidgetOverview link={link} />
        ) : (
          <GithubWidget link={link} />
        )
      );
    } else if (type === 'dribbble') {
      setWidgetType(
        size ? (
          <DribbleDesignWidgetOverview link={link} />
        ) : (
          <DribbleDesignWidget link={link} />
        )
      );
    } else if (type === 'spotify') {
      setWidgetType(
        size ? (
          <SpotifyWidgetOverview link={link} />
        ) : (
          <SpotifyWidget link={link} />
        )
      );
    } else if (type === 'youtube') {
      setWidgetType(
        size ? (
          <YoutubeVideoWidgetOverview link={link} />
        ) : (
          <YoutubeVideoWidget link={link} />
        )
      );
    } else if (type === 'soundCloud') {
      setWidgetType(
        size ? (
          <SoundCloudWidgetOverview link={link} />
        ) : (
          <SoundCloudWidget link={link} />
        )
      );
    } else if (type === 'instgram') {
      setWidgetType(
        size ? (
          <InstagramAccountWidgetOverview link='link' />
        ) : (
          <InstagramAccountWidget link={link} />
        )
      );
    }
  }, [type, link]);

  return <>{widgetType}</>;
};

export default UserWidgetContainer;
