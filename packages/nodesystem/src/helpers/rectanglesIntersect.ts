export default function rectanglesIntersect(rectA: Rect, rectB: Rect): boolean {
  const aLeftOfB = rectA.x2 < rectB.x1;
  const aRightOfB = rectA.x1 > rectB.x2;
  const aAboveB = rectA.y1 > rectB.y2;
  const aBelowB = rectA.y2 < rectB.y1;
  return !(aLeftOfB || aRightOfB || aAboveB || aBelowB);
}
