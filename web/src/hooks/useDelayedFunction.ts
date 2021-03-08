import { useEffect, useState } from 'react';
import { useMounted } from './useMounted';

export default function useDelayedFunction(delayedFunction: () => void) {
  const componentIsMounted = useMounted();

  const useDelay = (delay = 100) => {
    if (!componentIsMounted.current) return;
    setDelay(delay);
    setDelayEffect(true);
  };
  const [delay, setDelay] = useState(100);
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
