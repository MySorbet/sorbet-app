import React, { type HTMLAttributes, useRef, useState } from 'react';

interface SpotifyProps extends HTMLAttributes<HTMLIFrameElement> {
  [key: string]: any;

  link: string;
  wide?: boolean;
  width?: number | string;
  height?: number | string;
  frameBorder?: number | string;
  allow?: string;
}

const SpotifyWidgetOverview = ({
  link,
  // style = {},
  // wide = false,
  // width = wide ? "100%" : 300,
  // height = wide ? 80 : 380,
  frameBorder = 0,
  allow = 'encrypted-media',
  ...props
}: SpotifyProps) => {
  const url = new URL(link);

  const [backgroundColor, setBackgroundColor] = useState('');
  const colorPickerRef = useRef<HTMLInputElement>(null);

  // useEffect(() => {
  //   const iframe = document.querySelector(".spotifyWidget") as any;
  //   const parentContainer = document.querySelector(
  //     "#spotifyWidgetContainer"
  //   ) as HTMLElement;
  //   const timer = setTimeout(() => {
  //     if (iframe && parentContainer) {
  //       console.log("THIS IS RUNNING");
  //       iframe.contentWindow?.addEventListener("load", () => {
  //         const canvas = document.createElement("canvas");
  //         const iframeRect = iframe.getBoundingClientRect();
  //         canvas.width = 10;
  //         canvas.height = 10;
  //         const ctx = canvas.getContext("2d")!;
  //         ctx.drawImage(
  //           iframe,
  //           iframeRect.width / 2 - 5,
  //           iframeRect.height / 2 - 5,
  //           10,
  //           10,
  //           0,
  //           0,
  //           10,
  //           10
  //         );
  //         const imageData = ctx.getImageData(5, 5, 1, 1).data;
  //         const color = `rgba(${imageData[0]}, ${imageData[1]}, ${
  //           imageData[2]
  //         }, ${imageData[3] / 255})`;
  //         console.log(color);

  //         setBackgroundColor(color);
  //         colorPickerRef.current!.value = color;
  //       });
  //     }
  //   }, 1000);
  //   return () => clearTimeout(timer);
  // }, []);

  // function handleBackgroundColorChange(
  //   event: React.ChangeEvent<HTMLInputElement>
  // ) {
  //   setBackgroundColor(event.target.value);
  // }

  return (
    <div
      className='roundBorder relative flex h-[100px] w-full flex-col overflow-hidden rounded-xl'
      id='spotifyWidgetContainer'
      // style={{ backgroundColor }}
    >
      {/* <input
        type="color"
        ref={colorPickerRef}
        // onChange={handleBackgroundColorChange}
      /> */}

      <iframe
        className='spotifyWidget roundBorder absolute h-full w-full overflow-hidden rounded-xl'
        title='Spotify Widget'
        src={`https://open.spotify.com/embed${url.pathname}`}
        {...props}
      />
    </div>
  );
};

export default SpotifyWidgetOverview;

// Track example: <SpotifyWidget link="https://open.spotify.com/track/1CPSRRXGTQVgc1DIRWmLcg?si=b63f02bac318404d" />
// Album example: <SpotifyWidget link="https://open.spotify.com/album/527y5zpqdZc446EbgWPd6c?si=J9Ubk3bvT-arFUpp2pMxxw" />
// Wide Track example: <SpotifyWidget wide link="https://open.spotify.com/track/0mpTtYiDqkcOjNZqJLmjsO?si=e116707491c24ffc" />
// Wide Album example: <SpotifyWidget wide link="https://open.spotify.com/album/527y5zpqdZc446EbgWPd6c?si=J9Ubk3bvT-arFUpp2pMxxw" />
