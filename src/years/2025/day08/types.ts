export type Position = {
  x: number;
  y: number;
  z: number;
};

export type Edge = {
  a: number;
  b: number;
  distance: number;
};

export type Parsed = {
  positions: Position[];
};
