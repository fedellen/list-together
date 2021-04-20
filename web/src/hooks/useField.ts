import { useEffect, useState } from 'react';
import useDelayedFunction from 'src/hooks/useDelayedFunction';

/** Custom Hook for handling inputs */
export const useField = (initial = '') => {
  const [value, setValue] = useState(initial);
  const [initialDelay, setInitialDelay] = useState(true);
  const triggerDelay = useDelayedFunction(() => setInitialDelay(false));

  useEffect(() => {
    triggerDelay(100); // .1 second delay
  }, []);

  const onChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    if (!initialDelay) {
      setValue(event.target.value);
    }
  };

  return {
    value,
    onChange
  };
};
