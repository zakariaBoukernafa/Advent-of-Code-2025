# Advent of Code 2025 (TypeScript)

## Setup

```bash
npm install
```

## Run a day

```bash
npm run run -- <day> [part] [--year 2025] [--input path]
# examples
npm run run -- 1
npm run run -- 1 2
npm run run -- 5 --year 2025 --input inputs/2025/day05.txt
```

## Add a new day

```bash
npm run new:day -- <day> [--year 2025]
```

This creates:

- `src/years/<year>/dayXX/index.ts` – solution template (default export with `parse`, `part1`, `part2`)
- `inputs/<year>/dayXX.txt` – puzzle input placeholder

## Layout

- `src/run.ts` – CLI runner, loads a day's solution and input, runs parts
- `src/lib/*` – small helpers (paths, input reading, dynamic loader, shared types)
- `src/years/<year>/dayXX/` – one folder per day; add any helpers/tests alongside `index.ts`
- `inputs/<year>/dayXX.txt` – raw puzzle input files (ignored from TypeScript compile)

### Solution shape

Each `index.ts` exports a default `Solution`:

```ts
import { Solution } from "../../../lib/types";

type Parsed = string[];

const solution: Solution<Parsed> = {
  parse: (input) => input.trim().split("\n"),
  part1: (data) => /* ... */,
  part2: (data) => /* ... */,
};

export default solution;
```

`parse` is optional; if omitted, the runner passes the trimmed input string to each part.
