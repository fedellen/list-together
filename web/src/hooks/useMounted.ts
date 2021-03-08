import { useEffect, useRef } from 'react';

/** Returns true if the component is mounted */
export const useMounted = (): React.MutableRefObject<boolean> => {
  // On component mount, set to true
  const componentIsMounted = useRef(true);

  useEffect(() => {
    return () => {
      // On component un-mount, set to false
      componentIsMounted.current = false;
    };
  }, []);

  return componentIsMounted;
};
