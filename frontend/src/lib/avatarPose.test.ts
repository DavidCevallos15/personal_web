import { describe, expect, it } from 'vitest';
import { poseAxis } from './avatarPose';

describe('head pose selection', () => {
  it('maps the center and clamps distant pointers to the available poses', () => {
    expect(poseAxis(0, 3, 7)).toBe(3);
    expect(poseAxis(-8, 3, 7)).toBe(0);
    expect(poseAxis(8, 3, 7)).toBe(6);
    expect(poseAxis(-1, 1, 3)).toBe(0);
    expect(poseAxis(1, 1, 3)).toBe(2);
  });
  it('uses hysteresis to avoid flickering at a pose boundary', () => {
    expect(poseAxis(.18, 3, 7)).toBe(3);
    expect(poseAxis(.24, 3, 7)).toBe(4);
    expect(poseAxis(.18, 4, 7)).toBe(4);
    expect(poseAxis(.09, 4, 7)).toBe(3);
  });
});
