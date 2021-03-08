import { useState, useEffect } from 'react';
import useDelayedFunction from './useDelayedFunction';

type keyPair = {
  /**
   * Array of keyValues to trigger the provided callback function
   * Key value examples: 'a', 'b', 'y', 'Enter', 'Escape' ...
   * Full list of key values: https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key/Key_Values
   */
  keyValues: string[];
  /** Function to run on keyPress */
  callback: () => void;
  /** Cooldown after keyPress in ms, defaults to 100ms or 0.1 seconds */
  keyCooldown?: number;
};

/**
 * Takes an array of keyPairs to use keyboard functionality on
 *
 * Primary/secondary key value examples: 'a', 'b', 'y', 'Enter', 'Escape' ...
 *
 * Full list of key values: https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key/Key_Values
 *
 * @example
 * // Standard usage:
 * useKeyHandler([
 *  { keyValues: ['ArrowUp', 'W'], callback: () => handleMoveUp()) },
 *  { keyValues: ['ArrowDown', 'S'], callback: () => handleMoveDown()) },
 *  { keyValues: ['ArrowLeft', 'A'], callback: () => handleMoveLeft()) },
 *  { keyValues: ['ArrowRight', 'D'], callback: () => handleMoveRight()) },
 *]);
 *
 */

export const useKeyHandler = (keyPairs: keyPair[]) => {
  const [cooldown, setCooldown] = useState(false);
  const triggerCooldownCallback = useDelayedFunction(() => setCooldown(false));

  const keyPress = ({ key }: KeyboardEvent) => {
    if (!cooldown) {
      for (const { keyValues, callback, keyCooldown } of keyPairs) {
        if (keyValues.includes(key)) {
          setCooldown(true);
          triggerCooldownCallback(keyCooldown);
          callback();
        }
      }
    }
  };

  useEffect(() => {
    // Add event listener on mount
    window.addEventListener('keydown', keyPress);
    return () => {
      // Cleanup event listener upon component un-mount
      window.removeEventListener('keydown', keyPress);
    };
  });
};
