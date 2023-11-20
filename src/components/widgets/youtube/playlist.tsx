import React from 'react';

interface Props {
  id?: string;
  title?: string;
  styles?: object;
  width?: string;
  height?: string;
  autoplay?: string;
  cc_lang_pref?: string;
  cc_load_policy?: string;
  color?: string;
  controls?: string;
  disablekb?: string;
  enablejsapi?: string;
  end?: string;
  fs?: string;
  hl?: string;
  iv_load_policy?: string;
  list?: string;
  loop?: string;
  modestbranding?: string;
  origin?: string;
  playsinline?: string;
  rel?: string;
  start?: string;
  widget_referrer?: string;
  link: any;
}

const YoutubePlaylistWidget = (props: Props) => {
  const {
    id,
    title,
    styles,
    width,
    height,
    autoplay,
    cc_lang_pref,
    cc_load_policy,
    color,
    controls,
    disablekb,
    enablejsapi,
    end,
    fs,
    hl,
    iv_load_policy,
    list,
    loop,
    modestbranding,
    origin,
    playsinline,
    rel,
    start,
    widget_referrer,
  } = props;

  const id_var: string = id ? id : 'player'; // specifies the id of the iframe component
  const title_var: string = title ? title : 'Youtube Embed Widget'; // specifies the title of the widget (not rendered)
  const styles_var: object = styles ? styles : {}; // specifies any styles added to the widget
  const width_var: string = width ? width : '560'; // specifies the width of the widget
  const height_var: string = height ? height : '315'; // specifies the height of the video viewer
  const list_var: string = list
    ? list
    : 'OLAK5uy_noJB5es7H0dqkrtUCfqBAAxPn9tiIksGw'; // list var playlist id
  const autoplay_var: string = autoplay ? autoplay : '0'; // specifies whether the initial video will automatically start to play when the player loads. Supported values are 0 or 1. The default value is 0.
  const cc_lang_pref_var: string = cc_lang_pref ? cc_lang_pref : 'en'; // specifies the default language that the player will use to display captions. Set the parameter's value to an ISO 639-1 two-letter language code: https://www.loc.gov/standards/iso639-2/php/code_list.php
  const cc_load_policy_var: string = cc_load_policy ? cc_load_policy : '0'; // setting the parameter's value to 1 causes closed captions to be shown by default, even if the user has turned captions off. The default behavior is based on user preference.
  const color_var: string = color ? color : 'red'; // specifies the color that will be used in the player's video progress bar to highlight the amount of the video that the viewer has already seen. Valid parameter values are red and white, and, by default, the player uses the color red in the video progress bar.
  const controls_var: string = controls ? controls : '0'; // This parameter indicates whether the video player controls are displayed: controls=0 – Player controls do not display in the player. controls=1 (default) – Player controls display in the player.
  const disablekb_var: string = disablekb ? disablekb : '0'; // Setting the parameter's value to 1 causes the player to not respond to keyboard controls. The default value is 0, which means that keyboard controls are enabled. Currently supported keyboard controls are: Spacebar or [k]: Play / Pause, Arrow Left: Jump back 5 seconds in the current video, Arrow Right: Jump ahead 5 seconds in the current video, Arrow Up: Volume up, Arrow Down: Volume Down, [f]: Toggle full-screen display, [j]: Jump back 10 seconds in the current video, [l]: Jump ahead 10 seconds in the current video, [m]: Mute or unmute the video, [0-9]: Jump to a point in the video. 0 jumps to the beginning of the video, 1 jumps to the point 10% into the video, 2 jumps to the point 20% into the video, and so forth.
  const enablejsapi_var: string = enablejsapi ? enablejsapi : '0'; // Setting the parameter's value to 1 enables the player to be controlled via IFrame Player API calls. The default value is 0, which means that the player cannot be controlled using that API.
  const end_var: string = end ? end : ''; // This parameter specifies the time, measured in seconds from the start of the video, when the player should stop playing the video. The parameter value is a positive integer. Note that the time is measured from the beginning of the video and not from either the value of the start player parameter or the startSeconds parameter, which is used in YouTube Player API functions for loading or queueing a video.
  const fs_var: string = fs ? fs : '1'; // Setting this parameter to 0 prevents the fullscreen button from displaying in the player. The default value is 1, which causes the fullscreen button to display.
  const hl_var: string = hl ? hl : 'en'; // Sets the player's interface language. The parameter value is an ISO 639-1 two-letter language code or a fully specified locale. For example, fr and fr-ca are both valid values. Other language input codes, such as IETF language tags (BCP 47) might also be handled properly. The interface language is used for tooltips in the player and also affects the default caption track. Note that YouTube might select a different caption track language for a particular user based on the user's individual language preferences and the availability of caption tracks.
  const iv_load_policy_var: string = iv_load_policy ? iv_load_policy : '1'; // Setting the parameter's value to 1 causes video annotations to be shown by default, whereas setting to 3 causes video annotations to not be shown by default. The default value is 1.
  const loop_var: string = loop ? loop : '0'; // In the case of a single video player, a setting of 1 causes the player to play the initial video again and again. In the case of a playlist player (or custom player), the player plays the entire playlist and then starts again at the first video. Supported values are 0 and 1, and the default value is 0. EX: https://www.youtube.com/embed/VIDEO_ID?playlist=VIDEO_ID&loop=1
  const modestbranding_var: string = modestbranding ? modestbranding : '0'; // This parameter lets you use a YouTube player that does not show a YouTube logo. Set the parameter value to 1 to prevent the YouTube logo from displaying in the control bar. Note that a small YouTube text label will still display in the upper-right corner of a paused video when the user's mouse pointer hovers over the player.
  const origin_var: string = origin ? origin : ''; // This parameter provides an extra security measure for the IFrame API and is only supported for IFrame embeds. If you are using the IFrame API, which means you are setting the enablejsapi parameter value to 1, you should always specify your domain as the origin parameter value.
  const playsinline_var: string = playsinline ? playsinline : '0'; // This parameter controls whether videos play inline or fullscreen on iOS. Valid values are: 0: Results in fullscreen playback. This is currently the default value, though the default is subject to change. 1: Results in inline playback for mobile browsers and for WebViews created with the allowsInlineMediaPlayback property set to YES.
  const rel_var: string = rel ? rel : '0'; // if the rel parameter is set to 0, the player will show related videos that are from the same channel as the video that was just played.
  const start_var: string = start ? start : '0'; // This parameter causes the player to begin playing the video at the given number of seconds from the start of the video. The parameter value is a positive integer. Note that similar to the seekTo function, the player will look for the closest keyframe to the time you specify. This means that sometimes the play head may seek to just before the requested time, usually no more than around two seconds.
  const widget_referrer_var: string = widget_referrer ? widget_referrer : ''; // This parameter identifies the URL where the player is embedded. This value is used in YouTube Analytics reporting when the YouTube player is embedded in a widget, and that widget is then embedded in a web page or application. In that scenario, the origin parameter identifies the widget provider's domain, but YouTube Analytics should not identify the widget provider as the actual traffic source. Instead, YouTube Analytics uses the widget_referrer parameter value to identify the domain associated with the traffic source.

  // https://www.youtube.com/embed?listType=playlist&list=PLC77007E23FF423C6
  return (
    <div
      style={styles_var}
      className='roundBorder h-full  min-h-[270px] w-full  rounded-xl'
    >
      <iframe
        style={{ width: width_var, height: height_var }}
        className=' h-full w-full rounded-xl'
        id={id_var.toString()}
        title={title_var.toString()}
        // style={style_var}
        // width={width_var.toString()}
        // height={height_var.toString()}
        src={`https://www.youtube.com/embed/videoseries?list=${list_var}&autoplay=${autoplay_var}&cc_lang_pref=${cc_lang_pref_var}&cc_load_policy=${cc_load_policy_var}&color=${color_var}&controls=${controls_var}&disablekb=${disablekb_var}&enablejsapi=${enablejsapi_var}&end=${end_var}&fs=${fs_var}&hl=${hl_var}&iv_load_policy=${iv_load_policy_var}&loop=${loop_var}&modestbranding=${modestbranding_var}&origin=${origin_var}&playsinline=${playsinline_var}&rel=${rel_var}&start=${start_var}&widget_referrer=${widget_referrer_var}`}
        allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
        allowFullScreen
      ></iframe>
    </div>
  );
};

export default YoutubePlaylistWidget;
