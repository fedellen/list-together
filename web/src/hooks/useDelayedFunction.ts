import { useEffect, useState } from 'react';
import { useMounted } from './useMounted';

export default function useDelayedFunction(delayedFunction: () => void) {
  const componentIsMounted = useMounted();

  const [delayEffect, setDelayEffect] = useState(false);
  const [delay, setDelay] = useState(100); // 100ms default

  useEffect(() => {
    // Only run when delayEffect is triggered, immediately set to false
    if (!delayEffect || !componentIsMounted) return;
    setDelayEffect(false);

    setTimeout(() => {
      // Escape timeout if component has un-mounted
      if (!componentIsMounted.current) return;
      else delayedFunction();
    }, delay);
  }, [delayEffect]);

  /** Triggers function callback after specified delay. Default is 100ms */
  const sendDelay = (delay = 100) => {
    if (!componentIsMounted.current) return;
    setDelay(delay);
    setDelayEffect(true);
  };

  return sendDelay;
}
