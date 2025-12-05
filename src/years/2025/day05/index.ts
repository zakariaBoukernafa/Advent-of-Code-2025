import { Solution } from "../../../lib/types";
import { Range, Parsed } from "./types";

const parseRange = (line: string): Range => {
  const [startRaw, endRaw] = line.split("-");

  const start = Number(startRaw);
  const end = Number(endRaw);

  return { start, end };
};

const mergeRanges = (ranges: Range[]): Range[] => {
  const sorted = [...ranges].sort((a, b) => a.start - b.start || a.end - b.end);
  const merged: Range[] = [];

  for (const range of sorted) {
    const last = merged[merged.length - 1];
    if (!last || range.start > last.end + 1) {
      merged.push({ ...range });
    } else {
      last.end = Math.max(last.end, range.end);
    }
  }

  return merged;
};

const parse = (input: string): Parsed => {
  const [rangeBlock = "", ingredientBlock = ""] = input.trim().split(/\r?\n\r?\n/);

  const ranges = mergeRanges(
    rangeBlock
      .split(/\r?\n/)
      .filter(Boolean)
      .map(parseRange),
  );

  const ingredients = ingredientBlock
    .split(/\r?\n/)
    .filter(Boolean)
    .map((line) => Number(line));

  return { ranges, ingredients };
};

const isFresh = (id: number, ranges: Range[]): boolean => {
  let lo = 0;
  let hi = ranges.length - 1;

  while (lo <= hi) {
    const mid = Math.floor((lo + hi) / 2);
    const range = ranges[mid];
    if (id < range.start) {
      hi = mid - 1;
    } else if (id > range.end) {
      lo = mid + 1;
    } else {
      return true;
    }
  }

  return false;
};

const solution: Solution<Parsed> = {
  parse,
  part1: ({ ranges, ingredients }) =>
    ingredients.reduce((total, id) => total + (isFresh(id, ranges) ? 1 : 0), 0),
  part2: ({ ranges }) =>
    ranges.reduce((total, range) => total + (range.end - range.start + 1), 0),
};

export default solution;
