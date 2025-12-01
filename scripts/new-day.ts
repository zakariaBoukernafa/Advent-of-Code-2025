import { promises as fs } from "node:fs";
import path from "node:path";
import { inputPathFor, padDay, solutionPathFor } from "../src/lib/paths.js";

type Args = { day?: number; year: number };

function parseArgs(argv: string[]): Args {
  const args: Args = { year: 2025 };
  const positional: string[] = [];

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--year" || arg === "-y") {
      const value = Number(argv[++i]);
      if (Number.isNaN(value)) throw new Error("Year must be a number.");
      args.year = value;
    } else {
      positional.push(arg);
    }
  }

  if (positional[0]) args.day = Number(positional[0]);
  return args;
}

function normalizeImportPath(from: string, to: string): string {
  const relative = path.relative(from, to);
  const normalized = relative.startsWith(".") ? relative : `./${relative}`;
  return normalized.split(path.sep).join("/");
}

async function ensureFile(filePath: string, contents: string): Promise<boolean> {
  try {
    await fs.access(filePath);
    return false;
  } catch (error) {
    const err = error as NodeJS.ErrnoException;
    if (err.code !== "ENOENT") throw err;
  }

  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, contents, "utf8");
  return true;
}

function usage(): never {
  console.error("Usage: npm run new:day -- <day> [--year 2025]");
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

  const { day, year } = args;
  if (!day || Number.isNaN(day)) usage();

  const dayId = padDay(day);
  const solutionFile = solutionPathFor(year, day);
  const solutionDir = path.dirname(solutionFile);
  const inputFile = inputPathFor(year, day);
  const typesImport = normalizeImportPath(solutionDir, path.resolve("src/lib/types"));

  const scaffoldedSolution = await ensureFile(
    solutionFile,
    [
      `import { Solution } from "${typesImport}";`,
      "",
      "type Parsed = string;",
      "",
      "const solution: Solution<Parsed> = {",
      "  parse: (input) => input.trim(),",
      "  part1: (data) => {",
      '    // TODO: implement part 1',
      "    return data.length;",
      "  },",
      "  part2: (data) => {",
      '    // TODO: implement part 2',
      "    return data.length;",
      "  },",
      "};",
      "",
      "export default solution;",
      "",
    ].join("\n"),
  );

  const scaffoldedInput = await ensureFile(
    inputFile,
    "# Paste your puzzle input here\n",
  );

  console.log(`Day ${dayId} (${year})`);
  console.log(`- Solution: ${solutionFile} ${scaffoldedSolution ? "(created)" : "(exists)"}`);
  console.log(`- Input:    ${inputFile} ${scaffoldedInput ? "(created)" : "(exists)"}`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
