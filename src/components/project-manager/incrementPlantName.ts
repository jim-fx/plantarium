function containsIncrementer(string: string) {
  if (!string.includes("_")) return false;

  const a = string.split("_");

  if (isNaN(<number>(<unknown>a[a.length - 1]))) return false;

  return true;
}

function increment(name: string, alreadyTakenNames: string[]): string {
  let newName = "";

  if (containsIncrementer(name)) {
    let _s = name.split("_");
    _s[_s.length - 1] = parseInt(_s[_s.length - 1]) + 1 + "";
    newName = _s.join("_");
  } else {
    newName = name + "_1";
  }

  if (alreadyTakenNames.includes(newName)) {
    return increment(newName, alreadyTakenNames);
  } else {
    return newName;
  }
}

export default increment;
