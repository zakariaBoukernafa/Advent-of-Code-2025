import { performance } from "node:perf_hooks";
import { loadSolution } from "./lib/loader";
import { padDay } from "./lib/paths";
import { readInput } from "./lib/files";

type Args = {
  year: number;
  day?: number;
  part?: 1 | 2;
  inputPath?: string;
};

function parseArgs(argv: string[]): Args {
  const args: Args = { year: 2025 };
  const positional: string[] = [];

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    switch (arg) {
      case "-y":
      case "--year": {
        const value = Number(argv[++i]);
        if (Number.isNaN(value)) throw new Error("Year must be a number.");
        args.year = value;
        break;
      }
      case "-i":
      case "--input": {
        args.inputPath = argv[++i];
        break;
      }
      case "-p":
      case "--part": {
        args.part = parsePart(argv[++i]);
        break;
      }
      default:
        positional.push(arg);
    }
  }

  if (positional[0]) args.day = Number(positional[0]);
  if (positional[1] && args.part === undefined) args.part = parsePart(positional[1]);

  return args;
}

function parsePart(raw: string | undefined): 1 | 2 {
  if (!raw) throw new Error("Part is missing.");
  const value = Number(raw);
  if (value !== 1 && value !== 2) throw new Error("Part must be 1 or 2.");
  return value;
}

function usage(): never {
  console.error(
    [
      "Usage: npm run run -- <day> [part]",
      "Options:",
      "  -y, --year <number>   Year to run (default: 2025)",
      "  -p, --part <1|2>      Run only one part",
      "  -i, --input <path>    Optional custom input file",
      "",
      "Examples:",
      "  npm run run -- 1",
      "  npm run run -- 1 2",
      "  npm run run -- 5 --year 2025 --input inputs/2025/day05.txt",
    ].join("\n"),
  );
  process.exit(1);
}

async function main() {
  let args: Args;
  try {
    args = parseArgs(process.argv.slice(2));
  } catch (error) {
    console.error((error as Error).message);
    usage();
  }

  const { day, part = undefined, year } = args;
  if (!day || Number.isNaN(day)) usage();

  const { solution, file } = await loadSolution(year, day);
  const rawInput = await readInput(year, day, args.inputPath);
  const parsed = solution.parse ? await solution.parse(rawInput) : rawInput.trimEnd();
  const dayLabel = padDay(day);

  const runPart = async (which: 1 | 2) => {
    const fn = which === 1 ? solution.part1 : solution.part2;
    const started = performance.now();
    const result = await fn(parsed as never);
    const elapsedMs = performance.now() - started;

    console.log(
      `Day ${dayLabel} part ${which}: ${String(result)} (${elapsedMs.toFixed(2)} ms)`,
    );
  };

  console.log(`Running year ${year} day ${dayLabel} from ${file}`);

  if (part) {
    await runPart(part);
  } else {
    await runPart(1);
    await runPart(2);
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
