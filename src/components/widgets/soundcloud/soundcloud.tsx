'use client';
import React, { useEffect, useState } from 'react';

interface Props {
  link?: any;
  styles?: object;
  height?: string;
  width?: string;
  auto_play?: string;
  color?: string;
  buying?: string;
  sharing?: string;
  download?: string;
  show_artwork?: string;
  show_playcount?: string;
  show_user?: string;
  start_track?: string;
  single_active?: string;
}

const SoundCloudWidget = (props: Props) => {
  const [trackId, setTrackId] = useState<string | null>(null);

  const {
    link,
    styles,
    height,
    width,
    auto_play,
    color,
    buying,
    sharing,
    download,
    show_artwork,
    show_playcount,
    show_user,
    start_track,
    single_active,
  } = props;
  // "https://soundcloud.com/user-834611184/kanye-west-good-morning-graduation";
  const song_url_var: string = link ? link.toString() : ''; // Default '604411074' - Good Morning (Kanye West)
  const styles_var: object = styles ? styles : {}; // Default {} - no style
  const width_var: string = width ? width.toString() : '100%'; // Default '100%' width
  const height_var: string = height ? height.toString() : '133px'; // Default '133px' width
  const auto_play_var: string = auto_play ? auto_play.toString() : 'false'; // Default 'true'
  const color_var: string = color ? color.toString() : 'null'; // Defualt 'null' - no color change (soundcloud orange)
  const buying_var: string = buying ? buying.toString() : 'true'; // Default 'true'
  const sharing_var: string = sharing ? sharing.toString() : 'true'; // Default 'true'
  const download_var: string = download ? download.toString() : 'true'; // Default 'true'
  const show_artwork_var: string = show_artwork
    ? show_artwork.toString()
    : 'true'; // Default 'true'
  const show_playcount_var: string = show_playcount
    ? show_playcount.toString()
    : 'true'; // Default 'true'
  const show_user_var: string = show_user ? show_user.toString() : 'true'; // Default 'true'
  const start_track_var: string = start_track ? start_track.toString() : 'null'; // Default  null - no track start specified
  const single_active_var: string = single_active
    ? single_active.toString()
    : 'false'; // Default 'true'

  useEffect(() => {
    const fetchTrackId = async () => {
      const trackUrl = encodeURIComponent(song_url_var);
      const apiUrl = `${process.env.NEXT_PUBLIC_DEV_API_URL}/widgets/getSoundcloudTrackId/${trackUrl}`;
      fetch(apiUrl, {
        method: 'GET',
        headers: {
          accept: '*/*',
        },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then((data) => {
          console.log(data);
          setTrackId(data);
        })
        .catch((error) => {
          console.error(error);
        });
    };

    fetchTrackId();
  }, [song_url_var]);

  return (
    <>
      <iframe
        style={styles_var}
        width={width_var}
        height={height_var}
        allow='autoplay'
        src={`https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/${trackId}&amp;auto_play=${auto_play_var}&color=${color_var}&buying=${buying_var}&sharing=${sharing_var}&download=${download_var}&show_artwork=${show_artwork_var}&show_playcount=${show_playcount_var}&show_user=${show_user_var}&start_track=${start_track_var}&single_active=${single_active_var}`}
      ></iframe>
    </>
  );
};

export default SoundCloudWidget;
