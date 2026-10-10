/** Motion tokens (espejo de los `--ease-*` de index.css). Un easing por intención. */
export const ease = {
  feedback: [0.3, 0.08, 0.18, 1],
  interactive: [0.2, 0.8, 0.2, 1],
  disclosure: [0.16, 1, 0.3, 1],
  reveal: [0.32, 0.04, 0.18, 1],
} as const;

export const dur = { feedback: 0.16, interactive: 0.24, disclosure: 0.32, reveal: 0.98 } as const;
