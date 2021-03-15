/**
 * Hang the thread for X milliseconds
 *
 * Must be used in an async function
 *
 * @param delayMs default 2000ms (2 seconds)
 *
 * @example
 * await sleep(500) // wait .5 seconds
 *
 */

export const sleep = async (delayMs = 2000) => {
  await new Promise((resolve) => setTimeout(resolve, delayMs));
};
