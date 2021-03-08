import { useEffect, useState } from 'react';
import { useMounted } from './useMounted';

/** Takes a function and returns the trigger function */
export default function useDelay(delayedFunction: () => void) {
  const componentIsMounted = useMounted();
  const [delay, setDelay] = useState(100); // 100ms default

  const [delayEffect, setDelayEffect] = useState(false);
  useEffect(() => {
    if (!delayEffect || !componentIsMounted) return;
    setDelayEffect(false);

    setTimeout(() => {
      if (!componentIsMounted) return;
      else {
        // Run the delayed function if still mounted
        delayedFunction();
      }
    }, delay);
  }, [delayEffect, delayedFunction, delay, componentIsMounted]);

  /** Triggers function after specified delay. Default is 100ms */
  const sendDelay = (delay = 100) => {
    if (!componentIsMounted) return;
    setDelay(delay);
    setDelayEffect(true);
  };

  return sendDelay;
}
