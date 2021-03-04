import { useState, useEffect } from 'react';

export default function useKeyPress(targetKey: string, secondaryKey?: string) {
  const [keyPressed, setKeyPressed] = useState(false);

  const keyDown = ({ key }: KeyboardEvent) => {
    if (key === targetKey) {
      setKeyPressed(true);
    }
    if (secondaryKey && key === secondaryKey) {
      setKeyPressed(true);
    }
  };

  const keyUp = ({ key }: KeyboardEvent) => {
    if (key === targetKey) {
      setKeyPressed(false);
    }
    if (secondaryKey && key === secondaryKey) {
      setKeyPressed(false);
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', keyDown);
    window.addEventListener('keyup', keyUp);
    return () => {
      window.removeEventListener('keydown', keyDown);
      window.removeEventListener('keyup', keyUp);
    };
  });

  return keyPressed;
}
