import { useEffect } from 'react';

export default function useOnFocused(functionOnFocus: () => void) {
  useEffect(() => {
    window.addEventListener('focus', functionOnFocus);
    return () => {
      // Cleanup event listeners upon component un-mount
      window.removeEventListener('focus', functionOnFocus);
    };
  }, []);
}
