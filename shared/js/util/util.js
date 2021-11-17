// returns the number of elements in the array for which the function f
// returns true.
export function countInArray(array, f) {
  let counter = 0;
  for (let element of array) {
    if (f(element)) {
      counter++;
    }
  }
  return counter;
}

// shuffles the given array in place, also returning the shuffled version
export function shuffle(array) {
  let currentIndex = array.length;
  let randomIndex;

  // While there remain elements to shuffle...
  while (currentIndex != 0) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }

  return array;
}

// assumes the array contains strings. Does not work for arrays of objects currently.
export function countUniqueElementsInArray(array) {
  let elementsSeen = {};
  const haveNotSeenYet = (element) => {
    if (elementsSeen[element]) {
      return false;
    }
    else {
      elementsSeen[element] = true;
      return true;
    }
  };

  let uniqueEntryCount = countInArray(array, haveNotSeenYet);
  return uniqueEntryCount;
}
