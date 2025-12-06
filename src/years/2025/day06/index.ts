import { Solution } from "../../../lib/types";
import { Block, Operation, Parsed, Problem } from "./types";

const parse = (input: string): Parsed => {
  const lines = input.split(/\r?\n/);
  while (lines.length && lines[lines.length - 1] === "") lines.pop();

  const width = Math.max(...lines.map((line) => line.length));
  const padded = lines.map((line) => line.padEnd(width, " "));

  const numberRows = padded.slice(0, -1);
  const opRow = padded[padded.length - 1];

  const isBlankColumn = (col: number): boolean => padded.every((line) => line[col] === " ");

  const blocks: Block[] = [];
  for (let c = 0; c < width; ) {
    if (isBlankColumn(c)) {
      c += 1;
      continue;
    }

    const start = c;
    while (c < width && !isBlankColumn(c)) c += 1;
    const end = c - 1;
    const op = opRow.slice(start, end + 1).match(/[+*]/)![0] as Operation;

    blocks.push({ start, end, op });
  }

  return { blocks, numberRows };
};

const fromRows = ({ blocks, numberRows }: Parsed): Problem[] =>
  blocks.map(({ start, end, op }) => {
    const numbers = numberRows.map((row) => BigInt(row.slice(start, end + 1).replace(/\D/g, "")));
    return { numbers, op };
  });

const fromColumns = ({ blocks, numberRows }: Parsed): Problem[] =>
  blocks.map(({ start, end, op }) => {
    const numbers: bigint[] = [];
    for (let c = end; c >= start; c -= 1) {
      let digits = "";
      for (const row of numberRows) {
        const ch = row[c];
        if (ch !== " ") digits += ch;
      }
      if (digits.length) numbers.push(BigInt(digits));
    }
    return { numbers, op };
  });

const evaluate = ({ numbers, op }: Problem): bigint => {
  if (op === "+") {
    return numbers.reduce((sum, value) => sum + value, 0n);
  }
  return numbers.reduce((product, value) => product * value, 1n);
};

const solve = (problems: Problem[]): string => {
  const total = problems.reduce((sum, problem) => sum + evaluate(problem), 0n);
  return total.toString();
};

const solution: Solution<Parsed> = {
  parse,
  part1: (parsed) => solve(fromRows(parsed)),
  part2: (parsed) => solve(fromColumns(parsed)),
};

export default solution;
