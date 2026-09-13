export type StarFill = 'empty' | 'half' | 'full';

export const fillForIndex = (rating: number, index: number): StarFill => {
  const r = rating - index;
  if (r >= 1) return 'full';
  if (r >= 0.5) return 'half';
  return 'empty';
};
