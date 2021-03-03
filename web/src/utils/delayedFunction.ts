export default function delayedFunction(
  delayedFunction: () => void,
  delay = 2000
) {
  setTimeout(() => delayedFunction(), delay);
}
