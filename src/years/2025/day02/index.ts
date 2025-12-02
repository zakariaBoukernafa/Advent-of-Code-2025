import { Solution } from "../../../lib/types";
import { RangeSet, Range } from "./RangeSet";
import { PatternSolver } from "./PatternSolver";

const parse = (input: string): RangeSet => {
  const ranges: Range[] = input
    .trim()
    .split(",")
    .map((token) => token.trim())
    .filter(Boolean)
    .map((token) => {
      const [, startRaw, endRaw] = token.match(/^(\d+)-(\d+)$/) ?? [];
      if (!startRaw || !endRaw) throw new Error(`Bad range: ${token}`);
      const start = Number(startRaw);
      const end = Number(endRaw);
      if (start > end) throw new Error(`Range start after end: ${token}`);
      return { start, end };
    });
  return new RangeSet(ranges);
};

const solution: Solution<RangeSet> = {
  parse,
  part1: (ranges) => {
    const solver = new PatternSolver(ranges);
    return solver.sumDoubleRepeats();
  },
  part2: (ranges) => {
    const solver = new PatternSolver(ranges);
    return solver.sumAnyRepeats();
  },
};

export default solution;

