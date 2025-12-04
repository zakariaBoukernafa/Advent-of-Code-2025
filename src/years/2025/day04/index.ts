import { Solution } from "../../../lib/types";
import { Grid } from "./types";

const parse = (input: string): Grid => {
  const rows = input
    .trim()
    .split(/\r?\n/)
    .filter((line) => line.length > 0);

  return rows.map((line) => {
    return line.split("").map((ch) => ch === "@" ? true : false);
  });
};

const cloneGrid = (grid: Grid): Grid => grid.map((row) => [...row]);

const countAccessible = (grid: Grid): number => {
  const height = grid.length;
  const width = grid[0].length;
  const offsets = [-1, 0, 1];

  let accessible = 0;

  for (let r = 0; r < height; r++) {
    for (let c = 0; c < width; c++) {
      if (!grid[r][c]) continue;

      let neighbors = 0;
      for (const dr of offsets) {
        for (const dc of offsets) {
          if (dr === 0 && dc === 0) continue;
          const nr = r + dr;
          const nc = c + dc;
          if (nr < 0 || nr >= height || nc < 0 || nc >= width) continue;
          if (grid[nr][nc]) neighbors++;
        }
      }

      if (neighbors < 4) accessible++;
    }
  }

  return accessible;
};

const totalRemovable = (inputGrid: Grid): number => {
  const grid = cloneGrid(inputGrid);
  const height = grid.length;
  const width = grid[0].length;
  const offsets = [-1, 0, 1];

  const neighborCounts: number[][] = Array.from({ length: height }, () =>
    Array.from({ length: width }, () => 0),
  );

  for (let r = 0; r < height; r++) {
    for (let c = 0; c < width; c++) {
      if (!grid[r][c]) continue;
      for (const dr of offsets) {
        for (const dc of offsets) {
          if (dr === 0 && dc === 0) continue;
          const nr = r + dr;
          const nc = c + dc;
          if (nr < 0 || nr >= height || nc < 0 || nc >= width) continue;
          if (grid[nr][nc]) neighborCounts[r][c] += 1;
        }
      }
    }
  }

  const stack: Array<[number, number]> = [];
  for (let r = 0; r < height; r++) {
    for (let c = 0; c < width; c++) {
      if (grid[r][c] && neighborCounts[r][c] < 4) {
        stack.push([r, c]);
      }
    }
  }

  let removed = 0;

  while (stack.length) {
    const [r, c] = stack.pop()!;
    if (!grid[r][c]) continue;
    if (neighborCounts[r][c] >= 4) continue;

    grid[r][c] = false;
    removed += 1;

    for (const dr of offsets) {
      for (const dc of offsets) {
        if (dr === 0 && dc === 0) continue;
        const nr = r + dr;
        const nc = c + dc;
        if (nr < 0 || nr >= height || nc < 0 || nc >= width) continue;
        if (!grid[nr][nc]) continue;
        neighborCounts[nr][nc] -= 1;
        if (neighborCounts[nr][nc] < 4) {
          stack.push([nr, nc]);
        }
      }
    }
  }

  return removed;
};

const solution: Solution<Grid> = {
  parse,
  part1: (grid) => countAccessible(grid),
  part2: (grid) => totalRemovable(grid),
};

export default solution;
