import { promises as fs } from "node:fs";
import { pathToFileURL } from "node:url";
import { solutionPathFor } from "./paths";
import { Solution } from "./types";

export async function loadSolution(
  year: number,
  day: number,
): Promise<{ solution: Solution; file: string }> {
  const solutionFile = solutionPathFor(year, day);

  try {
    await fs.access(solutionFile);
  } catch (error) {
    const err = error as NodeJS.ErrnoException;
    if (err.code === "ENOENT") {
      throw new Error(
        `Solution file not found at ${solutionFile}. Run ` +
          "`npm run new:day -- <day>` to scaffold the folder or create it manually.",
      );
    }
    throw error;
  }

  const module = await import(pathToFileURL(solutionFile).href);
  const solution: Solution | undefined = module.default ?? module.solution;

  if (!solution) {
    throw new Error(`No Solution exported from ${solutionFile}. Export default { parse?, part1, part2 }.`);
  }

  return { solution, file: solutionFile };
}
