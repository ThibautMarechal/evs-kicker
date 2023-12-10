export function clamp(min: number, number: number, max: number) {
  return Math.min(Math.max(min, number), max);
}
