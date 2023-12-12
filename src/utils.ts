/**
 * Shuffle an array randomly. Taken from https://stackoverflow.com/a/48083382
 * @param array Array to be shuffled
 * @returns original array, shuffled
 */
export function shuffle<T>(array: T[]): T[] {
  let currentIndex = array.length,
    randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex != 0) {
    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
}

/**
 * Convert key code to english text
 */
export function convertCodeToText(code: string) {
  if (code.startsWith("Key")) {
    return code.substring(3);
  } else if (code.startsWith("Digit")) {
    return code.substring(5);
  } else if (code.startsWith("Arrow")) {
    return code.substring(5) + " Arrow";
  }
  // Add more conditions for other types of keys if necessary
  return code;
}
