export function poseAxis(value: number, previous: number, steps: number, hysteresis = .15) {
  const position = Math.max(0, Math.min(steps - 1, (value + 1) * (steps - 1) / 2));
  return Math.abs(position - previous) < .5 + hysteresis ? previous : Math.round(position);
}
