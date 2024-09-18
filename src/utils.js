export function debounce(callback, delay) {
  let timerId = 0;

  return (...args) => {
    window.clearTimeout(timerId);

    timerId = window.setTimeout(() => {
      callback(...args);
    }, delay);
  };
}