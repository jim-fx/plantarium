export default function getSeed(seed?: number) {
  if (typeof seed === "number") {
    return seed;
  } else {
    return Math.floor(Math.random() * 100000);
  }
}
