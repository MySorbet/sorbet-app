import React from 'react';

interface Props {
  reelUrl?: string;
  reelId?: string;
  width?: string;
  height?: string;
  styles?: object;
}

const InstagramReelWidget = (props: Props) => {
  const { reelUrl, reelId, width, height, styles } = props;

  const accountUrl_var: string = reelUrl
    ? reelUrl
    : 'https://www.instagram.com/reel/CpJtlX1p58f/embed';
  const reelId_var: string = reelId ? reelId : 'CpJtlX1p58f';
  const width_var: string = width ? width : '320';
  const height_var: string = height ? height : '200';
  const styles_var: object = styles ? styles : {};

  return (
    <>
      {reelUrl ? (
        <iframe
          style={styles_var}
          width={width_var}
          height={height_var}
          src={accountUrl_var}
        ></iframe>
      ) : null}
      {reelId ? (
        <iframe
          style={styles_var}
          width={width_var}
          height={height_var}
          src={`http://instagram.com/${reelId_var}/embed`}
        ></iframe>
      ) : null}
    </>
  );
};

export default InstagramReelWidget;
