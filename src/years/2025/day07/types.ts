export type Position = {
  row: number;
  col: number;
};

export type Parsed = {
  grid: string[];
  start: Position;
  width: number;
  height: number;
};
