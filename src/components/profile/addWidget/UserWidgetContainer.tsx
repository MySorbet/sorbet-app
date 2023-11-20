import React, { useEffect, useState } from 'react';

import DribbleDesignWidget from '@/components/widgets/dribbble/dribbble';
import GithubWidget from '@/components/widgets/github/github';
import InstagramAccountWidget from '@/components/widgets/instagram/profile';
import SoundCloudWidget from '@/components/widgets/soundcloud/soundcloud';
import SpotifyWidget from '@/components/widgets/spotify/spotify';
import YoutubeVideoWidget from '@/components/widgets/youtube/video';

interface Props {
  // id: string,
  link: string;
  type: string;
}

const UserWidgetContainer = ({ link, type }: Props) => {
  const [widgetType, setWidgetType] = useState<any>(null);
  useEffect(() => {
    if (type === 'github') {
      setWidgetType(<GithubWidget link={link} />);
    } else if (type === 'dribbble') {
      setWidgetType(<DribbleDesignWidget link={link} />);
    } else if (type === 'spotify') {
      setWidgetType(<SpotifyWidget link={link} />);
    } else if (type === 'youtube') {
      setWidgetType(<YoutubeVideoWidget link={link} />);
    } else if (type === 'soundCloud') {
      setWidgetType(<SoundCloudWidget link={link} />);
    } else if (type === 'instgram') {
      setWidgetType(<InstagramAccountWidget link={link} />);
    }
  }, [type, link]);

  return <>{widgetType}</>;
};

export default UserWidgetContainer;
