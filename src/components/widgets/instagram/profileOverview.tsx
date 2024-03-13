import React from 'react';

interface Props {
  link?: string;
  accountUrl?: string;
  username?: string;
  width?: string;
  height?: string;
  styles?: object;
}

const InstagramAccountWidgetOverview = (props: Props) => {
  const { accountUrl, username, width, height, styles } = props;

  const accountUrl_var: string = accountUrl
    ? accountUrl
    : 'https://www.instagram.com/savayabali/embed';
  const username_var: string = username ? username : 'savayabali';
  const width_var: string = width ? width : '100%';
  const height_var: string = height ? height : '100px';
  const styles_var: object = styles ? styles : {};

  return (
    <>
      {accountUrl ? (
        <iframe
          className='overflow-hidden'
          style={styles_var}
          width={width_var}
          height={height_var}
          src={accountUrl_var}
        ></iframe>
      ) : null}
      {username ? (
        <iframe
          className='overflow-hidden'
          style={styles_var}
          width={width_var}
          height={height_var}
          src={`http://instagram.com/${username_var}/embed`}
        ></iframe>
      ) : null}
    </>
  );
};

export default InstagramAccountWidgetOverview;
