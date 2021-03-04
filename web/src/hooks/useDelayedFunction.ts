import { useEffect, useRef, useState } from 'react';

export default function useDelayedFunction(delayedFunction: () => void) {
  const componentIsMounted = useRef(true);
  useEffect(() => {
    return () => {
      componentIsMounted.current = false;
    };
  }, []);

  const useDelay = (delay = 2000) => {
    setDelay(delay);
    setDelayEffect(true);
  };
  const [delay, setDelay] = useState(2000);
  const [delayEffect, setDelayEffect] = useState(false);
  useEffect(() => {
    if (!delayEffect) return;
    setDelayEffect(false);
    setTimeout(() => {
      if (!componentIsMounted.current) return;
      else delayedFunction();
    }, delay);
  }, [delayEffect]);

  return useDelay;
}
