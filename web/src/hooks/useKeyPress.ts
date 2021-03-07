import { useState, useEffect } from 'react';

/**
 * Returns true if primary or secondary key is currently pressed.
 *
 * Primary/secondary key value examples: 'a', 'b', 'y', 'Enter', 'Escape' ...
 *
 * Full list of key values: https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key/Key_Values
 *
 * @example
 * // Standard usage:
 * const handleKeyPress = useKeyPress(' '); // ' ' key is Space Bar
 * if (handleKeyPress) myKeyboardLogic();
 *
 * // When dispatching actions that would result in
 * // un-mounting the component, useEffect is required:
 * useEffect(() => {
 *   if (handleKeyPress) dispatch({ type: 'KEY_EVENT' });
 * }, [handleKeyPress]);
 *
 * // Complicated keyboard usage should be refactored to a
 * // more centralized system. But for a few simple async
 * // mutations, adding another useState is a quick fix:
 * const [mutationLoading, setMutationLoading] = useState(false);
 *
 * const upKeyPress = useKeyPress('ArrowUp');
 * const downKeyPress = useKeyPress('ArrowDown');
 *
 * if (!mutationLoading) {
 *   if (upKeyPress) {
 *     setMutationLoading(true);
 *     asyncUpKeyMutation();
 *   } else if (downKeyPress) {
 *     setMutationLoading(true);
 *     asyncDownKeyMutation();
 *   }
 * }
 *
 */

export default function useKeyPress(primaryKey: string, secondaryKey?: string) {
  const [keyPressed, setKeyPressed] = useState(false);

  const keyPress = ({ key }: KeyboardEvent) => {
    if (key === primaryKey) {
      setKeyPressed(true);
    } else if (secondaryKey && key === secondaryKey) {
      setKeyPressed(true);
    }
  };

  const keyRelease = ({ key }: KeyboardEvent) => {
    if (key === primaryKey) {
      setKeyPressed(false);
    } else if (secondaryKey && key === secondaryKey) {
      setKeyPressed(false);
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', keyPress);
    window.addEventListener('keyup', keyRelease);
    return () => {
      // Cleanup event listeners upon component un-mount
      window.removeEventListener('keydown', keyPress);
      window.removeEventListener('keyup', keyRelease);
    };
  }, []);

  return keyPressed;
}
