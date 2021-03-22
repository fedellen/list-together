import { useRef, useEffect, useState } from 'react';
import useDelayedFunction from './useDelayedFunction';

/**
 * Pauses video when exiting viewport, plays video when entering the viewport
 * Also adds pause/play on click functionality
 *
 *  @example
 *
 * const [videoRef, handleVideoClick] = useVideoInViewport();
 *
 * return(
 *    <video
 *      ref={videoRef}
 *      onClick={handleVideoClick}
 *      // Other options (src, loop)
 *    />
 * );
 *
 */
export const useVideoInViewport = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  /** Pause permanently if user clicks on video */
  const [userPaused, setUserPaused] = useState(false);
  const handleVideoClick = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
      } else {
        videoRef.current.pause();
        setUserPaused(true);
      }
    }
  };

  const viewportHeight =
    window.innerHeight || document.documentElement.clientHeight;

  const [cooldown, setCooldown] = useState(false);
  const triggerCooldownCallback = useDelayedFunction(() => setCooldown(false));
  const handleScroll = () => {
    if (!userPaused && !cooldown) {
      setCooldown(true);
      triggerCooldownCallback(500); // Check scroll every .5 sec
      if (videoRef.current) {
        const { top, bottom } = videoRef.current.getBoundingClientRect();
        const inViewport = viewportHeight - top > -100 && bottom > 100;

        if (videoRef.current.paused && inViewport) {
          // Play if in viewport and paused
          videoRef.current.play();
        } else if (!videoRef.current.paused && !inViewport) {
          // Pause if not in viewport and playing
          videoRef.current.pause();
        }
      }
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll]);

  return [videoRef, handleVideoClick] as const;
};
