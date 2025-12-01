import { Solution } from "../../../lib/types";
import { Step } from "./types";

const mod = (n: number, m: number) => ((n % m) + m) % m;

const parse = (input: string): Step[] =>
  input
    .trim()
    .split(/\s+/)
    .map((token) => {
      const [, turn, raw] = token.match(/^([LR])(\d+)$/) ?? [];
      if (!turn) throw new Error(`Bad token: ${token}`);
      return { turn: turn as "L" | "R", steps: Number(raw) };
    });

const solution: Solution<Step[]> = {
  parse,
  part1: (steps) =>
    steps.reduce(
      ({ pos, zeros }, step) => {
        const size = 100;
        const delta = (step.turn === "R" ? step.steps : -step.steps) % size;
        const next = mod(pos + delta, size);
        return { pos: next, zeros: zeros + (next === 0 ? 1 : 0) };
      },
      { pos: 50, zeros: 0 },
    ).zeros,

  part2: (steps) => {
    const size = 100;

    const countHits = (pos: number, step: Step) => {
      const dir = step.turn === "R" ? 1 : -1;
      const totalSteps = step.steps;

      const firstToZero =
        dir === 1 ? (size - pos) % size || size : pos % size || size;

      const hits =
        firstToZero > totalSteps
          ? 0
          : 1 + Math.floor((totalSteps - firstToZero) / size);

      const next = mod(pos + dir * totalSteps, size);
      return { next, hits };
    };

    return steps.reduce(
      ({ pos, zeros }, step) => {
        const { next, hits } = countHits(pos, step);
        return { pos: next, zeros: zeros + hits };
      },
      { pos: 50, zeros: 0 },
    ).zeros;
  },
};

export default solution;
