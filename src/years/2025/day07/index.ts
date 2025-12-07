import { Solution } from "../../../lib/types";
import { Parsed, Position } from "./types";

const parse = (input: string): Parsed => {
  const grid = input.trim().split(/\r?\n/);
  const height = grid.length;
  const width = grid[0].length;

  let start: Position = { row: 0, col: 0 };
  for (let row = 0; row < height; row += 1) {
    const col = grid[row].indexOf("S");
    if (col !== -1) {
      start = { row, col };
      break;
    }
  }

  return { grid, start, width, height };
};

const countSplits = ({ grid, start, width, height }: Parsed): number => {
  let beams = new Set<number>([start.col]);
  let splits = 0;

  for (let row = start.row + 1; row < height && beams.size; row += 1) {
    const line = grid[row];
    const pending = [...beams];
    const seen = new Set<number>();
    const next = new Set<number>();

    while (pending.length) {
      const col = pending.pop()!;
      if (seen.has(col)) continue;
      seen.add(col);

      if (line[col] === "^") {
        splits += 1;
        if (col > 0) pending.push(col - 1);
        if (col + 1 < width) pending.push(col + 1);
      } else {
        next.add(col);
      }
    }

    beams = next;
  }

  return splits;
};

const countTimelines = ({ grid, start, width, height }: Parsed): bigint => {
  let incoming = Array<bigint>(width).fill(0n);
  incoming[start.col] = 1n;

  for (let row = start.row + 1; row < height; row += 1) {
    const rowCounts = incoming.slice();
    const queue: number[] = [];
    for (let col = 0; col < width; col += 1) {
      if (rowCounts[col] !== 0n) queue.push(col);
    }

    const next = Array<bigint>(width).fill(0n);

    while (queue.length) {
      const col = queue.pop()!;
      const count = rowCounts[col];
      if (count === 0n) continue;
      rowCounts[col] = 0n;

      if (grid[row][col] === "^") {
        if (col > 0) {
          rowCounts[col - 1] += count;
          queue.push(col - 1);
        }
        if (col + 1 < width) {
          rowCounts[col + 1] += count;
          queue.push(col + 1);
        }
      } else {
        next[col] += count;
      }
    }

    incoming = next;
  }

  return incoming.reduce((sum, count) => sum + count, 0n);
};

const solution: Solution<Parsed> = {
  parse,
  part1: (parsed) => countSplits(parsed),
  part2: (parsed) => countTimelines(parsed).toString(),
};

export default solution;
