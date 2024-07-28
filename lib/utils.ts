/**
 * Debounce function
 * @param func - The function to debounce
 * @param wait - The number of milliseconds to delay
 * @param immediate - If true, trigger the function on the leading edge, instead of the trailing
 * @returns A debounced version of the passed function
 */
export function debounce<T extends (...args: any[]) => void>(
  func: T,
  wait: number,
  immediate = false
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null;

  return function (this: any, ...args: Parameters<T>): void {
    const context = this;

    const later = function () {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };

    const callNow = immediate && !timeout;

    if (timeout) clearTimeout(timeout);

    timeout = setTimeout(later, wait);

    if (callNow) func.apply(context, args);
  };
}

/**
 * Deletes the browser cookie
 * @param name - Cookie key
 */
export function removeCookie(name: string) {
  // This function will attempt to remove a cookie from all paths.
  const pathBits = location.pathname.split("/");
  let pathCurrent = " path=";

  // do a simple pathless delete first.
  document.cookie = name + "=; expires=Thu, 01-Jan-1970 00:00:01 GMT;";

  for (let i = 0; i < pathBits.length; i++) {
    pathCurrent += (pathCurrent.substring(-1) != "/" ? "/" : "") + pathBits[i];
    document.cookie =
      name + "=; expires=Thu, 01-Jan-1970 00:00:01 GMT;" + pathCurrent + ";";
  }
}

/**
 * Formats the seconds to human readable string
 * @param seconds
 * @returns
 */
export function formatSeconds(seconds: number) {
  // Calculate days, hours, minutes, and remaining seconds
  const days = Math.floor(seconds / (24 * 3600));
  seconds %= 24 * 3600;
  const hours = Math.floor(seconds / 3600);
  seconds %= 3600;
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  // Build the formatted time string
  let formattedTime = "";

  if (days > 0) {
    formattedTime += `${days} D, ${hours} H`;
  } else if (hours > 0) {
    formattedTime += `${hours} H ${minutes} M`;
  } else if (minutes > 0) {
    formattedTime += `${minutes} M ${remainingSeconds} S`;
  } else {
    formattedTime += `${remainingSeconds} S`;
  }

  return formattedTime;
}

/**
 * Returns random color
 * @returns color string in hex
 */
export function randomColor() {
  const colors = ["#FF5733", "#33FF57", "#3357FF", "#FF33A1", "#33FFF6"];
  return colors[Math.floor(Math.random() * colors.length)];
}
