// import { useEffect, useRef } from 'react';
import { useVideoInViewport } from 'src/hooks/useVideoInViewport';

type LandingVideoProps = {
  /** File source; `/media/video-name.mp4` */
  src: string;
  /** Video width in pixels as string; `"640"`  */
  width: string;
  /** Short video description */
  ariaLabel: string;
};

export default function LandingVideo({
  src,
  width,
  ariaLabel
}: LandingVideoProps) {
  const [videoRef, handleVideoClick] = useVideoInViewport();

  return (
    <video
      ref={videoRef}
      width={`${width}px`}
      src={src}
      muted={true}
      loop={true}
      className="landing-video"
      aria-label={ariaLabel}
      onClick={handleVideoClick}
    />
  );
}
