import React from 'react';

interface Props {
  postUrl?: string;
  postId?: string;
  width?: string;
  height?: string;
  styles?: object;
}

const InstagramPostWidget = (props: Props) => {
  const { postUrl, postId, width, height, styles } = props;

  const postUrl_var: string = postUrl
    ? postUrl
    : 'https://www.instagram.com/p/CpB35fHpSq8/embed';
  const postId_var: string = postId ? postId : 'CpB35fHpSq8';
  const width_var: string = width ? width : '320';
  const height_var: string = height ? height : '600';
  const styles_var: object = styles ? styles : {};

  return (
    <>
      {postUrl ? (
        <iframe
          style={styles_var}
          width={width_var}
          height={height_var}
          src={postUrl_var}
        ></iframe>
      ) : null}
      {postId ? (
        <iframe
          style={styles_var}
          width={width_var}
          height={height_var}
          src={`http://instagram.com/p/${postId_var}/embed`}
        ></iframe>
      ) : null}
    </>
  );
};

export default InstagramPostWidget;
